// =============================================================
// VOICE.JS  —  Live Voice Chat for Sovereignty Engine DEMO
// Uses browser-native Web Speech API (no server required).
//   • SpeechRecognition  → speech-to-text  (STT)
//   • SpeechSynthesis    → text-to-speech  (TTS)
// =============================================================

(function () {
    const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

    // --- state ---
    let micActive  = false;
    let ttsEnabled = true;
    let recognition = null;

    // --- DOM refs (set on load) ---
    let btnMic, btnTts, voiceLabel;

    window.addEventListener("load", () => {
        btnMic     = document.getElementById("btn-mic");
        btnTts     = document.getElementById("btn-tts");
        voiceLabel = document.getElementById("voice-label");

        // Graceful degradation — hide controls if API not available
        if (!SpeechRecognition) {
            console.warn("SpeechRecognition is not supported in this browser. " +
                         "Voice input is unavailable.");
            if (btnMic)     btnMic.style.display     = "none";
            if (btnTts)     btnTts.style.display     = "none";
            if (voiceLabel) voiceLabel.style.display = "none";
            return;
        }

        // --------------------------------------------------
        // RECOGNITION SETUP
        // --------------------------------------------------
        recognition = new SpeechRecognition();
        recognition.continuous      = false; // browser ends session on silence;
        recognition.interimResults  = true;  // stream interim text to input
        recognition.lang            = "en-US";

        recognition.onresult = (e) => {
            let interim = "";
            let final   = "";
            for (let i = e.resultIndex; i < e.results.length; i++) {
                const transcript = e.results[i][0].transcript;
                if (e.results[i].isFinal) {
                    final += transcript;
                } else {
                    interim += transcript;
                }
            }
            // Show interim speech in the input field as grey preview
            // termIn / handleMessage are globals defined in UI.js (loaded before Voice.js)
            if (interim) {
                termIn.value = interim;
            }
            // Commit final transcript exactly like pressing Enter
            if (final) {
                termIn.value = "";
                handleMessage(final.trim());
            }
        };

        // Auto-restart while mic is still toggled on (browser stops on silence)
        recognition.onend = () => {
            if (micActive) {
                try { recognition.start(); } catch (_) { /* already started */ }
            }
        };

        recognition.onerror = (e) => {
            if (e.error === "not-allowed" || e.error === "service-not-allowed") {
                micActive = false;
                syncMicUI();
                console.warn("Microphone access denied.");
            }
        };

        // --------------------------------------------------
        // MIC BUTTON
        // --------------------------------------------------
        btnMic.addEventListener("click", () => {
            micActive = !micActive;
            syncMicUI();
            if (micActive) {
                try { recognition.start(); } catch (_) {}
            } else {
                recognition.stop();
                termIn.value = "";
            }
        });

        // --------------------------------------------------
        // TTS TOGGLE BUTTON
        // --------------------------------------------------
        btnTts.addEventListener("click", () => {
            ttsEnabled = !ttsEnabled;
            if (!ttsEnabled) speechSynthesis.cancel();
            syncTtsUI();
        });
    });

    // --------------------------------------------------
    // UI SYNC HELPERS
    // --------------------------------------------------

    function syncMicUI() {
        if (!btnMic) return;
        btnMic.classList.toggle("mic-active", micActive);
        btnMic.title = micActive ? "Stop listening" : "Start voice input";
        if (voiceLabel) {
            voiceLabel.textContent = micActive ? "● LISTENING" : "";
        }
    }

    function syncTtsUI() {
        if (!btnTts) return;
        btnTts.classList.toggle("tts-muted", !ttsEnabled);
        btnTts.textContent = ttsEnabled ? "🔊" : "🔇";
        btnTts.title = ttsEnabled ? "Mute voice output" : "Unmute voice output";
    }

    // --------------------------------------------------
    // TTS — called from UI.js after kernel reply is printed
    // --------------------------------------------------

    window.speakReply = function (text) {
        if (!ttsEnabled) return;
        speechSynthesis.cancel(); // stop any in-progress speech
        const utt = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utt);
    };

})();
