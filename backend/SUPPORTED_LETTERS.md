# ASL Hand Alphabet Recognition - Supported Letters

This system recognizes **24 out of 26** ASL hand alphabet letters using MediaPipe hand landmark detection.

## ✅ Supported Letters (A-Y, excluding J and Z)

| Letter | Description |
|--------|-------------|
| **A** | Fist with thumb alongside |
| **B** | Four fingers extended together, thumb across palm |
| **C** | Curved hand forming C shape |
| **D** | Index finger up, other fingers and thumb together |
| **E** | All fingers curled, thumb curled over |
| **F** | Index finger touching thumb, other fingers extended |
| **G** | Index finger and thumb extended horizontally |
| **H** | Index and middle fingers extended together horizontally |
| **I** | Pinky finger extended, other fingers curled, thumb across |
| **K** | Index and middle fingers extended in V, thumb between them |
| **L** | Index finger and thumb extended at 90 degrees |
| **M** | Three fingers over thumb (similar to A, S, N, T) |
| **N** | Two fingers over thumb (similar to A, S, M, T) |
| **O** | All fingers curved forming O shape with thumb |
| **P** | Index and middle fingers pointing down, thumb out |
| **Q** | Index finger and thumb pointing down |
| **R** | Index and middle fingers crossed |
| **S** | Fist with thumb across fingers |
| **T** | Thumb between index and middle fingers |
| **U** | Index and middle fingers extended together upward |
| **V** | Index and middle fingers extended in V shape |
| **W** | Index, middle, and ring fingers extended |
| **X** | Index finger curved/hooked |
| **Y** | Thumb and pinky extended (shaka/hang loose) |

## ❌ Not Supported (Motion Required)

| Letter | Reason |
|--------|--------|
| **J** | Requires drawing motion with pinky finger |
| **Z** | Requires drawing zigzag motion with index finger |

## Detection Parameters

- **Confidence Threshold**: 0.70 - 0.75 (varies by letter)
- **Hand Detection**: MediaPipe Hands with min_detection_confidence=0.5
- **Max Hands**: 1 (processes only the first detected hand)

## Notes

- Some letters are very similar (e.g., M, N, S, T, A) and may require careful hand positioning
- Letters R and U are identical except for finger crossing, which can be challenging to detect
- Best results with good lighting and clear hand visibility
- Hold hand steady and centered in frame for optimal detection
