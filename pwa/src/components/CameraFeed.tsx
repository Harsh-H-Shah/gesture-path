import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';
import * as handpose from '@tensorflow-models/handpose';
import Webcam from 'react-webcam';
import { VideoIcon } from 'lucide-react';
import type { Keypoint } from '@tensorflow-models/hand-pose-detection';

import { useGestureStore } from '../state/useGestureStore';
import { gestureMap, GestureID } from '../gestures/definitions';

// Poll every 100 ms (~10 FPS)
const DETECTION_INTERVAL = 100;
// Timeout if estimateHands() hangs
const TIMEOUT_MS = 3000;
// We still require two consecutive detections before “locking in” a gesture
const GESTURE_THRESHOLD = 2;

export const CameraFeed: React.FC = () => {
  const webcamRef = useRef<Webcam>(null);
  const modelRef = useRef<handpose.HandPose | null>(null);

  // Two‐frame tracking
  const prevRawRef = useRef<string>('NONE');
  const stableRef = useRef<string | null>(null);
  const countRef = useRef(0);

  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const setGesture = useGestureStore((s) => s.set);
  const currentRef = useRef<string | null>(null);
  const commitGesture = (g: string | null) => {
    if (g !== currentRef.current) {
      currentRef.current = g;
      setGesture(g);
    }
  };

  /**
   * Given pixel landmarks[], normalize them and apply the same six‐gesture logic,
   * plus our new “DisableGestures” (all five extended ↑).
   */
  const detectRaw = (landmarks: Keypoint[]): string => {
    const video = webcamRef.current!.video!;
    const w = video.videoWidth,
      h = video.videoHeight;
    if (w === 0 || h === 0) return 'NONE';

    const N = (i: number) => ({
      x: landmarks[i][0] / w,
      y: landmarks[i][1] / h,
      z: (landmarks[i][2] ?? 0) / w,
    });

    const wrist = N(0);
    const thumbTip = N(4);
    const indexTip = N(8);
    const middleTip = N(12);
    const ringTip = N(16);
    const pinkyTip = N(20);

    const indexBase = N(5);
    const middleBase = N(9);
    const ringBase = N(13);
    const pinkyBase = N(17);

    const idxExt = indexTip.y < indexBase.y - 0.1 * 0.8;
    const midExt = middleTip.y < middleBase.y - 0.1 * 0.8;
    const ringExt = ringTip.y < ringBase.y - 0.1 * 0.8;
    const pinExt = pinkyTip.y < pinkyBase.y - 0.1 * 0.8;

    // ---- Check “open palm” (all five fingers up) first: DisableGestures ----
    const thumbExt = thumbTip.y < wrist.y - 0.1;
    if (thumbExt && idxExt && midExt && ringExt && pinExt) {
      return GestureID.DisableGestures;
    }

    // Move Forward (two fingers ↑)
    if (
      idxExt &&
      midExt &&
      !ringExt &&
      !pinExt &&
      indexTip.y < wrist.y - 0.1 * 0.8
    ) {
      return GestureID.TwoUp;
    }

    // Move Backward (two fingers ↓)
    if (
      indexTip.y > indexBase.y + 0.1 * 0.8 &&
      middleTip.y > middleBase.y + 0.1 * 0.8 &&
      !ringExt &&
      !pinExt &&
      Math.abs(indexTip.y - middleTip.y) < 0.1
    ) {
      return GestureID.TwoDown;
    }

    // Only check thumb if no other extended
    const anyExt = idxExt || midExt || ringExt || pinExt;
    if (!anyExt) {
      // Look Up (thumb ↑)
      if (thumbTip.y < wrist.y - 0.1) {
        return GestureID.ThumbUp;
      }
      // Look Down (thumb ↓)
      if (thumbTip.y > wrist.y + 0.1) {
        return GestureID.ThumbDown;
      }
      // Turn Left (thumb ←)
      if (thumbTip.x < wrist.x - 0.1) {
        return GestureID.ThumbLeft;
      }
      // Turn Right (thumb →)
      if (thumbTip.x > wrist.x + 0.1) {
        return GestureID.ThumbRight;
      }
    }

    return 'NONE';
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let canceled = false;

    const start = async () => {
      setLoading(true);
      modelRef.current = await handpose.load();
      console.log('[G] Handpose model loaded');
      setLoading(false);

      intervalId = setInterval(async () => {
        if (canceled) return;
        if (
          !modelRef.current ||
          !webcamRef.current ||
          !webcamRef.current.video ||
          webcamRef.current.video.readyState !== 4
        ) {
          return;
        }

        const video = webcamRef.current.video!;
        const vw = video.videoWidth,
          vh = video.videoHeight;
        // Resize to actual resolution
        webcamRef.current.video.width = vw;
        webcamRef.current.video.height = vh;

        // Run estimateHands() with a 3s timeout
        let hands;
        try {
          hands = (await Promise.race([
            modelRef.current.estimateHands(video),
            new Promise<never>((_, rej) =>
              setTimeout(() => rej(new Error('timeout')), TIMEOUT_MS)
            ),
          ])) as handpose.AnnotatedPrediction[];
        } catch {
          return;
        }

        console.log('[G] hands=', hands.length);

        if (hands.length > 0 && hands[0].landmarks) {
          const raw = detectRaw(hands[0].landmarks as unknown as Keypoint[]);
          console.log('[G] raw gesture=', raw);

          // If user shows **all five fingers up**, disable
          if (raw === GestureID.DisableGestures) {
            setEnabled(false);
            return;
          }

          // If new raw ≠ stable & raw ≠ NONE, clear old
          if (
            stableRef.current &&
            raw !== stableRef.current &&
            raw !== 'NONE'
          ) {
            stableRef.current = null;
            commitGesture(null);
          }

          if (raw !== 'NONE') {
            if (raw === prevRawRef.current) {
              countRef.current++;
              if (countRef.current >= GESTURE_THRESHOLD) {
                if (raw !== stableRef.current) {
                  stableRef.current = raw;
                  commitGesture(raw);
                }
              }
            } else {
              prevRawRef.current = raw;
              countRef.current = 1;
            }
          } else {
            if (stableRef.current) {
              prevRawRef.current = 'NONE';
              countRef.current = 0;
              stableRef.current = null;
              commitGesture(null);
            }
          }
        } else {
          // No hand detected → clear any stable
          if (stableRef.current) {
            prevRawRef.current = 'NONE';
            countRef.current = 0;
            stableRef.current = null;
            commitGesture(null);
          }
        }
      }, DETECTION_INTERVAL);
    };

    if (enabled) {
      start();
    }

    return () => {
      canceled = true;
      clearInterval(intervalId);
      modelRef.current = null;
      prevRawRef.current = 'NONE';
      stableRef.current = null;
      countRef.current = 0;
      commitGesture(null);
    };
  }, [enabled]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Overlay shown until enabled=true */}
      {!enabled && (
        <div
          onClick={() => setEnabled(true)}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            zIndex: 10,
          }}
        >
          <VideoIcon size={64} className="mb-4" />
          <button
            onClick={() => setEnabled(true)}
            style={{
              backgroundColor: '#1abc9c',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '18px',
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Enable Gestures
          </button>
          <div style={{ marginTop: '12px', fontSize: '14px', color: '#ccc' }}>
            (Show all FIVE fingers up at any time to disable)
          </div>
        </div>
      )}

      {/* Webcam only mounts once “enabled” is true */}
      {enabled && (
        <Webcam
          ref={webcamRef}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          mirrored
          audio={false}
          videoConstraints={{ facingMode: 'user' }}
        />
      )}

      {/* While Handpose is loading, show a loading message */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            fontSize: '18px',
            zIndex: 20,
          }}
        >
          Loading model…
        </div>
      )}
    </div>
  );
};
