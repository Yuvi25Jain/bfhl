using UnityEngine;

namespace DesiPlay.Gameplay
{
    public class StoneManager : MonoBehaviour
    {
        public static StoneManager Instance { get; private set; }

        public GameObject[] stones; // Array of 7 stones
        private Rigidbody[] stoneRbs;

        public bool AreStonesBroken { get; private set; }
        public int StonesRebuiltCount { get; private set; } = 0;

        private void Awake()
        {
            Instance = this;
            stoneRbs = new Rigidbody[stones.Length];
            for (int i = 0; i < stones.Length; i++)
            {
                stoneRbs[i] = stones[i].GetComponent<Rigidbody>();
            }
        }

        public void BreakStones()
        {
            if (AreStonesBroken) return;
            AreStonesBroken = true;
            Debug.Log("Stones broken! Defenders need to hit players, Hitters need to rebuild.");
            
            // Apply explosion force for dramatic effect
            foreach (var rb in stoneRbs)
            {
                rb.isKinematic = false;
                rb.AddExplosionForce(500f, transform.position + Vector3.down, 5f);
            }
        }

        public void RebuildStone()
        {
            if (!AreStonesBroken || StonesRebuiltCount >= stones.Length) return;

            // Logic to snap stone back into place
            Rigidbody targetStone = stoneRbs[StonesRebuiltCount];
            targetStone.isKinematic = true;
            targetStone.transform.localPosition = new Vector3(0, StonesRebuiltCount * 0.5f, 0); // Stack vertically
            targetStone.transform.localRotation = Quaternion.identity;

            StonesRebuiltCount++;

            if (StonesRebuiltCount == stones.Length)
            {
                Core.GameManager.Instance.EndGame(hitterTeamWon: true);
            }
        }
    }
}
