using UnityEngine;
using UnityEngine.UI;

namespace DesiPlay.UI
{
    public class UIManager : MonoBehaviour
    {
        public CanvasGroup splashScreen;
        public CanvasGroup homeScreen;
        public CanvasGroup lobbyScreen;
        public CanvasGroup gameScreen;
        
        public Button playButton;

        private void Start()
        {
            ShowScreen(splashScreen);
            // Simulate loading
            Invoke(nameof(ShowHome), 2f);

            if (playButton != null)
                playButton.onClick.AddListener(OnPlayClicked);
        }

        public void ShowHome()
        {
            ShowScreen(homeScreen);
        }

        private void OnPlayClicked()
        {
            ShowScreen(lobbyScreen);
            Network.FirebaseRTDBManager.Instance?.JoinOrCreateRoom();
            
            // Assume we matched after 2 seconds
            Invoke(nameof(StartGame), 2f);
        }

        private void StartGame()
        {
            ShowScreen(gameScreen);
            Core.GameManager.Instance?.StartGame(true);
        }

        private void ShowScreen(CanvasGroup screen)
        {
            if (splashScreen) { splashScreen.alpha = 0; splashScreen.blocksRaycasts = false; }
            if (homeScreen) { homeScreen.alpha = 0; homeScreen.blocksRaycasts = false; }
            if (lobbyScreen) { lobbyScreen.alpha = 0; lobbyScreen.blocksRaycasts = false; }
            if (gameScreen) { gameScreen.alpha = 0; gameScreen.blocksRaycasts = false; }

            if (screen != null)
            {
                screen.alpha = 1;
                screen.blocksRaycasts = true;
            }
        }
    }
}
