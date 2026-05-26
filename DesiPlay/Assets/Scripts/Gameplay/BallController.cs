using UnityEngine;

namespace DesiPlay.Gameplay
{
    [RequireComponent(typeof(Rigidbody))]
    public class BallController : MonoBehaviour
    {
        private Rigidbody rb;
        private Vector2 swipeStartPos;
        private Vector2 swipeEndPos;

        [Header("Throw Settings")]
        public float throwForceMultiplier = 0.5f;
        public float maxThrowForce = 20f;
        public float upwardForce = 2f;

        private void Awake()
        {
            rb = GetComponent<Rigidbody>();
        }

        private void Update()
        {
            if (Core.GameManager.Instance.CurrentState != Core.GameManager.GameState.Playing) return;

            // Simple Touch / Swipe input
            if (Input.GetMouseButtonDown(0))
            {
                swipeStartPos = Input.mousePosition;
            }
            else if (Input.GetMouseButtonUp(0))
            {
                swipeEndPos = Input.mousePosition;
                Vector3 throwVector = CalculateThrowVector(swipeStartPos, swipeEndPos);
                Throw(throwVector);
            }
        }

        private Vector3 CalculateThrowVector(Vector2 start, Vector2 end)
        {
            Vector2 swipeDir = end - start;
            Vector3 throwDir = new Vector3(swipeDir.x, swipeDir.magnitude * upwardForce, swipeDir.y);
            return Vector3.ClampMagnitude(throwDir * throwForceMultiplier, maxThrowForce);
        }

        public void Throw(Vector3 throwVelocity)
        {
            rb.isKinematic = false;
            rb.velocity = throwVelocity;
            
            // Note: In real setup, you'd sync this
            // Network.FirebaseRTDBManager.Instance?.SyncBallThrow(throwVelocity);
        }

        private void OnCollisionEnter(Collision collision)
        {
            if (collision.gameObject.CompareTag("Stone"))
            {
                // Note: Logic logic handled by network sync ideally
                // Network.FirebaseRTDBManager.Instance?.SyncStonesHit();
            }
        }
    }
}
