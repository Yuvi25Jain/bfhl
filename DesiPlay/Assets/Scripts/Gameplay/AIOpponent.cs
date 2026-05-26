using UnityEngine;
using UnityEngine.AI;

namespace DesiPlay.Gameplay
{
    [RequireComponent(typeof(NavMeshAgent))]
    public class AIOpponent : MonoBehaviour
    {
        private NavMeshAgent agent;
        public Transform ballTarget;
        public Transform playerTarget;

        public float throwRange = 5f;
        
        private void Awake()
        {
            agent = GetComponent<NavMeshAgent>();
        }

        private void Update()
        {
            // if (Core.GameManager.Instance.CurrentState != Core.GameManager.GameState.Playing) return;

            // Simple state machine
            if (StoneManager.Instance != null && StoneManager.Instance.AreStonesBroken)
            {
                // Defenders logic: Chase ball, then throw at player
                if (ballTarget != null && Vector3.Distance(transform.position, ballTarget.position) > 1f)
                {
                    agent.SetDestination(ballTarget.position);
                }
                else if (playerTarget != null && Vector3.Distance(transform.position, playerTarget.position) < throwRange)
                {
                    // Throw at player
                    Debug.Log("AI Throws ball at Player!");
                    // Trigger ball throw animation / throw logic
                }
            }
            else
            {
                // Idle or simple evade
                if (agent.isOnNavMesh)
                {
                    agent.isStopped = true;
                }
            }
        }
    }
}
