using UnityEngine;

namespace DesiPlay.Monetization
{
    public class AdManager : MonoBehaviour
    {
        // Add AdMob reference here
        
        private string adUnitId = "ca-app-pub-3940256099942544/5224354917"; // Google test ad

        private void Start()
        {
            // Initialize the Google Mobile Ads SDK.
            // MobileAds.Initialize(initStatus => { });
            Debug.Log("AdMob initialized with Test Unit ID.");
        }

        public void ShowRewardedAd()
        {
            Debug.Log("Showing Rewarded Ad...");
            // Load and show logic
        }

        public void RewardUser()
        {
            Debug.Log("User rewarded with Coins!");
        }
    }
}
