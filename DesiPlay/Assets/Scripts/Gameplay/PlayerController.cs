using UnityEngine;

namespace DesiPlay.Gameplay
{
    [RequireComponent(typeof(CharacterController))]
    public class PlayerController : MonoBehaviour
    {
        private CharacterController controller;
        public float speed = 5f;

        private void Awake()
        {
            controller = GetComponent<CharacterController>();
        }

        private void Update()
        {
            // if (Core.GameManager.Instance.CurrentState != Core.GameManager.GameState.Playing) return;

            Move();
            HandleRebuild();
        }

        private void Move()
        {
            Vector3 moveDir = new Vector3(Input.GetAxis("Horizontal"), 0, Input.GetAxis("Vertical"));

            if (moveDir.magnitude > 0.1f)
            {
                controller.Move(moveDir * speed * Time.deltaTime);
                transform.rotation = Quaternion.LookRotation(moveDir);
                
                // Sync position logic
                // Network.FirebaseRTDBManager.Instance?.SyncPlayerPosition(transform.position);
            }
        }

        private void HandleRebuild()
        {
            // Simple logic: if near stones and tapping Rebuild button
            if (Input.GetKeyDown(KeyCode.R) || (Input.touchCount > 0 && Input.GetTouch(0).phase == TouchPhase.Began)) // Simplification
            {
                if (StoneManager.Instance != null && Vector3.Distance(transform.position, StoneManager.Instance.transform.position) < 2f)
                {
                    StoneManager.Instance.RebuildStone();
                }
            }
        }
    }
}
