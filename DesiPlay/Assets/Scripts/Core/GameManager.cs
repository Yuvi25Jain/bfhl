using UnityEngine;
using System;

namespace DesiPlay.Core
{
    public class GameManager : MonoBehaviour
    {
        public static GameManager Instance { get; private set; }

        public enum GameState { Waiting, Playing, GameOver }
        public GameState CurrentState { get; private set; }

        public bool IsHitterTeam { get; private set; } // True if local player's team is breaking stones

        public event Action<GameState> OnGameStateChanged;

        private void Awake()
        {
            if (Instance == null) Instance = this;
            else Destroy(gameObject);
        }

        public void StartGame(bool asHitter)
        {
            IsHitterTeam = asHitter;
            ChangeState(GameState.Playing);
            Debug.Log($"Game Started. Local player is Hitter: {IsHitterTeam}");
        }

        public void EndGame(bool hitterTeamWon)
        {
            ChangeState(GameState.GameOver);
            bool localWon = hitterTeamWon == IsHitterTeam;
            Debug.Log($"Game Over. Local player Win: {localWon}");
            // Handle rewards, UI popup
        }

        private void ChangeState(GameState newState)
        {
            CurrentState = newState;
            OnGameStateChanged?.Invoke(newState);
        }
    }
}
