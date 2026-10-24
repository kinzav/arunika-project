
/* ==================================================
   ARUNIKA - TTS DAN VISUALISASI RITME
   ================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // ==============================================
    // TEXT TO SPEECH (TTS)
    // ==============================================

    const ttsPlay = document.getElementById("ttsPlay");
    const ttsPause = document.getElementById("ttsPause");
    const ttsResume = document.getElementById("ttsResume");
    const ttsStop = document.getElementById("ttsStop");
    const ttsStatus = document.getElementById("ttsStatus");

    const article = document.querySelector("[data-tts]");

    let currentUtterance = null;

    const ttsSupported =
        "speechSynthesis" in window &&
        "SpeechSynthesisUtterance" in window;

    function updateTtsStatus(message) {
        if (ttsStatus) {
            ttsStatus.textContent = message;
        }
    }

    function setTtsButtons(playing) {
        if (ttsPause) ttsPause.disabled = !playing;
        if (ttsResume) ttsResume.disabled = !playing;
    }

    function stopTts(message = "Pembacaan dihentikan.") {
        if (ttsSupported) {
            window.speechSynthesis.cancel();
        }

        currentUtterance = null;
        setTtsButtons(false);
        updateTtsStatus(message);
    }

    if (!ttsSupported) {
        updateTtsStatus(
            "Browser ini belum mendukung fitur pembaca teks."
        );

        [ttsPlay, ttsPause, ttsResume, ttsStop].forEach(button => {
            if (button) button.disabled = true;
        });
    } else {
        setTtsButtons(false);

        if (ttsPlay) {
            ttsPlay.addEventListener("click", () => {
                if (!article) {
                    updateTtsStatus(
                        "Artikel yang akan dibacakan tidak ditemukan."
                    );
                    return;
                }

                const text = article.innerText
                    .replace(/\s+/g, " ")
                    .trim();

                if (!text) {
                    updateTtsStatus("Tidak ada teks untuk dibacakan.");
                    return;
                }

                // Hentikan pembacaan sebelumnya
                window.speechSynthesis.cancel();


                const utterance = new SpeechSynthesisUtterance(text);

                utterance.lang = "id-ID";
                utterance.rate = 0.9;
                utterance.pitch = 1;
                utterance.volume = 1;

                function pilihSuaraIndonesia() {
                    const voices = window.speechSynthesis.getVoices();

                    const suaraIndonesia = voices.find(voice =>
                        voice.lang.toLowerCase() === "id-id"
                    );

                    if (suaraIndonesia) {
                        utterance.voice = suaraIndonesia;
                    }
                }

                pilihSuaraIndonesia();

                window.speechSynthesis.addEventListener(
                    "voiceschanged",
                    pilihSuaraIndonesia
                );

                currentUtterance = utterance;



                utterance.onstart = () => {
                    updateTtsStatus("Sedang membacakan artikel...");
                    setTtsButtons(true);
                };

                utterance.onend = () => {
                    if (currentUtterance === utterance) {
                        currentUtterance = null;
                        setTtsButtons(false);
                        updateTtsStatus("Artikel selesai dibacakan.");
                    }
                };

                utterance.onerror = event => {
                    if (currentUtterance === utterance) {
                        currentUtterance = null;
                        setTtsButtons(false);

                        if (event.error !== "canceled" &&
                            event.error !== "interrupted") {
                            updateTtsStatus(
                                "Pembacaan gagal. Coba tekan Putar lagi."
                            );
                        }
                    }
                };

                window.speechSynthesis.speak(utterance);
            });
        }

        if (ttsPause) {
            ttsPause.addEventListener("click", () => {
                if (window.speechSynthesis.speaking &&
                    !window.speechSynthesis.paused) {
                    window.speechSynthesis.pause();
                    updateTtsStatus("Pembacaan dijeda.");
                }
            });
        }

        if (ttsResume) {
            ttsResume.addEventListener("click", () => {
                if (window.speechSynthesis.paused) {
                    window.speechSynthesis.resume();
                    updateTtsStatus("Melanjutkan pembacaan...");
                }
            });
        }

        if (ttsStop) {
            ttsStop.addEventListener("click", () => {
                stopTts();
            });
        }
    }

    // ==============================================
    // VISUALISASI RITME
    // ==============================================

    const visualizer = document.getElementById("ritmeVisualizer");
    const tempoInput = document.getElementById("ritmeTempo");
    const tempoValue = document.getElementById("ritmeTempoValue");
    const ritmePlay = document.getElementById("ritmePlay");
    const ritmeStop = document.getElementById("ritmeStop");
    const ritmeStatus = document.getElementById("ritmeStatus");

    if (
        visualizer &&
        tempoInput &&
        tempoValue &&
        ritmePlay &&
        ritmeStop &&
        ritmeStatus
    ) {
        function updateTempo() {
            const bpm = Number(tempoInput.value);

            tempoValue.value = `${bpm} BPM`;
            tempoValue.textContent = `${bpm} BPM`;

            // Satu ketukan kira-kira 60 / BPM detik.
            const duration = 60 / bpm;

            visualizer.style.setProperty(
                "--ritme-duration",
                `${duration}s`
            );
        }
        function startVisualizer() {
            visualizer.classList.add("is-playing");

            visualizer.setAttribute(
                "aria-label",
                "Visualisasi ritme sedang bergerak"
            );

            ritmeStatus.textContent =
                `Visualisasi berjalan pada tempo ${tempoInput.value} BPM.`;
        }

        function stopVisualizer() {
            visualizer.classList.remove("is-playing");

            visualizer.setAttribute(
                "aria-label",
                "Visualisasi ritme dalam keadaan berhenti"
            );

            ritmeStatus.textContent =
                "Animasi ritme dihentikan.";
        }

        tempoInput.addEventListener("input", () => {
            updateTempo();

            if (visualizer.classList.contains("is-playing")) {
                ritmeStatus.textContent =
                    `Tempo diubah menjadi ${tempoInput.value} BPM.`;
            }
        });

        ritmePlay.addEventListener("click", startVisualizer);
        ritmeStop.addEventListener("click", stopVisualizer);

        updateTempo();
    }
});
