 gsap.registerPlugin(ScrollTrigger);
        
        const tracks = [
            {
                id: 1,
                title: "Celestial Dawn",
                artist: "NØTE Collective",
                duration: "4:32",
                img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                src: "music/muiscs (4).mp3"
            },
            {
                id: 2,
                title: "Midnight Sonata",
                artist: "NØTE Collective",
                duration: "5:18",
                img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                src: "music/muiscs (8).mp3"
            },
            {
                id: 3,
                title: "Aurora Drift",
                artist: "NØTE Collective",
                duration: "6:45",
                img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                src: "music/muiscs (1).mp3"
            },
            {
                id: 4,
                title: "Quantum Echoes",
                artist: "NØTE Collective",
                duration: "7:22",
                img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1770&q=80",
                src: "music/muiscs (7).mp3"
            }
        ];

        const audioPlayer = document.getElementById('audio-player');
        const playPauseBtn = document.getElementById('play-pause-btn');
        const playPauseIcon = document.getElementById('play-pause-icon');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const progressBar = document.getElementById('progress-bar');
        const seekBar = document.getElementById('seek-bar');
        const currentTimeEl = document.getElementById('current-time');
        const durationEl = document.getElementById('duration');
        const nowPlayingImg = document.getElementById('now-playing-img');
        const nowPlayingTitle = document.getElementById('now-playing-title');
        const nowPlayingArtist = document.getElementById('now-playing-artist');
        const musicPlayerToggle = document.getElementById('music-player-toggle');
        const musicPlayer = document.getElementById('music-player');
        const volumeControl = document.getElementById('volume-control');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileMenu = document.getElementById('mobile-menu');
        const navbar = document.getElementById('navbar');
        const experienceDemoBtn = document.getElementById('experience-demo-btn');
        const bookConsultationBtn = document.getElementById('book-consultation-btn');
        
        let currentTrackIndex = 0;
        let isPlaying = false;
        let isSeeking = false;
        
        class AuthSystem {
            constructor() {
                this.currentUser = null;
                this.users = JSON.parse(localStorage.getItem('note_users') || '[]');
                this.loadCurrentUser();
                this.updateNavbar();
            }
            
            loadCurrentUser() {
                const userId = localStorage.getItem('note_current_user');
                if (userId) {
                    this.currentUser = this.users.find(u => u.id === userId) || null;
                }
            }
            
            signup(userData) {
                if (!this.validatePassword(userData.password)) {
                    return { success: false, error: 'Password does not meet requirements' };
                }
                
                if (this.users.some(u => u.email === userData.email)) {
                    return { success: false, error: 'Email already registered' };
                }
                
                const newUser = {
                    id: 'user_' + Date.now(),
                    ...userData,
                    profilePic: null,
                    createdAt: new Date().toISOString()
                };
                
                this.users.push(newUser);
                localStorage.setItem('note_users', JSON.stringify(this.users));
                
                this.login(userData.email, userData.password);
                
                return { success: true, user: newUser };
            }
            
            validatePassword(password) {
                const rules = [
                    password.length >= 8,
                    /[A-Z]/.test(password),
                    /[a-z]/.test(password),
                    /[0-9]/.test(password),
                    /[!@#$%^&*(),.?":{}|<>]/.test(password)
                ];
                return rules.every(rule => rule);
            }
            
            login(email, password) {
                const user = this.users.find(u => u.email === email && u.password === password);
                
                if (user) {
                    this.currentUser = user;
                    localStorage.setItem('note_current_user', user.id);
                    this.updateNavbar();
                    return { success: true, user };
                }
                
                return { success: false, error: 'Invalid email or password' };
            }
            
            logout() {
                this.currentUser = null;
                localStorage.removeItem('note_current_user');
                this.updateNavbar();
                showToast('Logged Out', 'You have been successfully logged out.');
            }
            
            updateProfile(updates) {
                if (!this.currentUser) return false;
                
                const userIndex = this.users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    this.users[userIndex] = { ...this.users[userIndex], ...updates };
                    this.currentUser = this.users[userIndex];
                    localStorage.setItem('note_users', JSON.stringify(this.users));
                    this.updateNavbar();
                    return true;
                }
                return false;
            }
            
            updateNavbar() {
                const authButtons = document.getElementById('auth-buttons');
                const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
                
                if (this.currentUser) {
                    authButtons.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <button onclick="showProfileModal()" class="flex items-center space-x-3 glass-effect-light hover:bg-purple-900/20 rounded-2xl px-4 py-2 transition-all">
                                <div class="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
                                    ${this.currentUser.profilePic ? 
                                        `<img src="${this.currentUser.profilePic}" alt="Profile" class="w-full h-full object-cover">` : 
                                        `<span class="text-white font-bold">${this.currentUser.name.charAt(0)}</span>`}
                                </div>
                                <span class="text-white font-semibold">${this.currentUser.name.split(' ')[0]}</span>
                            </button>
                            <button onclick="authSystem.logout()" class="luxury-btn glass-effect border border-purple-900/30 hover:border-purple-700 text-white font-bold py-2 px-6 rounded-full text-sm">
                                Logout
                            </button>
                        </div>
                    `;
                    
                    mobileAuthButtons.innerHTML = `
                        <div class="space-y-4">
                            <div class="flex items-center space-x-3 p-4 glass-effect-light rounded-2xl">
                                <div class="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-700 to-purple-900 flex items-center justify-center">
                                    ${this.currentUser.profilePic ? 
                                        `<img src="${this.currentUser.profilePic}" alt="Profile" class="w-full h-full object-cover">` : 
                                        `<span class="text-white font-bold text-lg">${this.currentUser.name.charAt(0)}</span>`}
                                </div>
                                <div>
                                    <h4 class="text-white font-bold">${this.currentUser.name.split(' ')[0]}</h4>
                                    <p class="text-purple-400 text-sm">${this.currentUser.userType === 'artist' ? '🎤 Artist' : '👤 User'}</p>
                                </div>
                            </div>
                            <button onclick="showProfileModal()" class="w-full luxury-btn glass-effect border border-purple-900/30 hover:border-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg">
                                <i class="fas fa-user mr-2"></i>My Profile
                            </button>
                            <button onclick="authSystem.logout()" class="w-full luxury-btn glass-effect border border-gray-700 hover:border-gray-600 text-white font-bold py-4 px-8 rounded-full text-lg">
                                <i class="fas fa-sign-out-alt mr-2"></i>Logout
                            </button>
                        </div>
                    `;
                } else {
                    authButtons.innerHTML = `
                        <div class="flex items-center space-x-4">
                            <button onclick="showLoginModal()" class="luxury-btn glass-effect border border-purple-900/30 hover:border-purple-700 text-white font-bold py-2 px-6 rounded-full text-sm">
                                Login
                            </button>
                            <button onclick="showSignupModal()" class="luxury-btn bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-2 px-6 rounded-full text-sm">
                                Sign Up
                            </button>
                        </div>
                    `;
                    
                    mobileAuthButtons.innerHTML = `
                        <div class="space-y-4">
                            <button onclick="showLoginModal()" class="w-full luxury-btn glass-effect border border-purple-900/30 hover:border-purple-700 text-white font-bold py-4 px-8 rounded-full text-lg">
                                <i class="fas fa-sign-in-alt mr-2"></i>Login
                            </button>
                            <button onclick="showSignupModal()" class="w-full luxury-btn bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-4 px-8 rounded-full text-lg">
                                <i class="fas fa-user-plus mr-2"></i>Sign Up
                            </button>
                        </div>
                    `;
                }
            }
        }

        const authSystem = new AuthSystem();

        function init() {
            loadTrack(currentTrackIndex);
            
            setupAnimations();
            
            setupEventListeners();
            
            updateSubmissionForm();
            
            setupAudioEvents();
        }
        
        function setupAudioEvents() {
            audioPlayer.addEventListener('timeupdate', updateProgress);
            audioPlayer.addEventListener('ended', playNextTrack);
            audioPlayer.addEventListener('loadedmetadata', updateDuration);
            
            volumeControl.addEventListener('input', function() {
                audioPlayer.volume = this.value / 100;
            });
            
            seekBar.addEventListener('input', function() {
                isSeeking = true;
                const seekTime = (audioPlayer.duration * (this.value / 100));
                currentTimeEl.textContent = formatTime(seekTime);
                progressBar.style.width = this.value + '%';
            });
            
            seekBar.addEventListener('change', function() {
                isSeeking = false;
                const seekTime = (audioPlayer.duration * (this.value / 100));
                audioPlayer.currentTime = seekTime;
            });
        }
        
        function setupAnimations() {
            gsap.from(".big-heading", {
                duration: 1.5,
                y: 100,
                opacity: 0,
                ease: "power3.out",
                stagger: 0.2
            });
            
            gsap.from(".hero-video", {
                duration: 2,
                scale: 1.2,
                ease: "power2.out"
            });
            
            ScrollTrigger.create({
                start: "100px top",
                onUpdate: (self) => {
                    if (self.direction === -1) {
                        gsap.to(navbar, {
                            y: 0,
                            opacity: 1,
                            duration: 0.5
                        });
                    } else {
                        gsap.to(navbar, {
                            y: -100,
                            opacity: 0,
                            duration: 0.5
                        });
                    }
                }
            });
            
            gsap.utils.toArray('section').forEach(section => {
                if (section.id === 'home') return;
                
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        end: "bottom 20%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 1,
                    ease: "power2.out"
                });
            });
            
            gsap.from(".service-card", {
                scrollTrigger: {
                    trigger: "#services",
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                y: 100,
                opacity: 1,
                duration: 1,
                stagger: 0.3,
                ease: "power3.out"
            });
            
            gsap.from(".artist-card", {
                scrollTrigger: {
                    trigger: "#artists",
                    start: "top 85%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                y: 80,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });
        }
        
        function setupEventListeners() {
            playPauseBtn.addEventListener('click', togglePlayPause);
            prevBtn.addEventListener('click', playPrevTrack);
            nextBtn.addEventListener('click', playNextTrack);
            
            musicPlayerToggle.addEventListener('click', () => {
                musicPlayer.classList.toggle('hidden');
                gsap.fromTo(musicPlayer, 
                    { scale: 0.8, opacity: 0 },
                    { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(1.7)" }
                );
            });
            
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
                gsap.fromTo(mobileMenu, 
                    { y: -20, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }
                );
            });
            
            document.querySelectorAll('.play-btn').forEach(btn => {
                btn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    const trackId = parseInt(this.getAttribute('data-track')) || 1;
                    playTrack(trackId - 1);
                    
                    if (musicPlayer.classList.contains('hidden')) {
                        musicPlayer.classList.remove('hidden');
                    }
                    
                    gsap.to(this, {
                        scale: 0.9,
                        duration: 0.1,
                        yoyo: true,
                        repeat: 1
                    });
                });
            });
            
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 100,
                            behavior: 'smooth'
                        });
                        
                        if (!mobileMenu.classList.contains('hidden')) {
                            mobileMenu.classList.add('hidden');
                        }
                    }
                });
            });
            
            experienceDemoBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                if (audioPlayer.paused) {
                    audioPlayer.play();
                    isPlaying = true;
                    playPauseIcon.className = 'fas fa-pause';
                    
                    if (musicPlayer.classList.contains('hidden')) {
                        musicPlayer.classList.remove('hidden');
                    }
                    
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-volume-up mr-3"></i>Now Playing';
                    this.classList.add('from-purple-600', 'to-purple-800');
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('from-purple-600', 'to-purple-800');
                    }, 2000);
                } else {
                    audioPlayer.pause();
                    isPlaying = false;
                    playPauseIcon.className = 'fas fa-play';
                    
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-pause mr-3"></i>Paused';
                    this.classList.add('from-purple-800', 'to-purple-900');
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.classList.remove('from-purple-800', 'to-purple-900');
                    }, 2000);
                }
                
                gsap.to(this, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            });
            
            bookConsultationBtn.addEventListener('click', function(e) {
                e.preventDefault();
                showModal('consultation-modal');
            });
            
            document.getElementById('consultation-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = {
                    name: this.querySelector('input[type="text"]').value,
                    email: this.querySelector('input[type="email"]').value,
                    projectType: this.querySelector('select').value,
                    message: this.querySelector('textarea').value,
                    contactMethod: this.querySelector('input[name="contact"]:checked').value,
                    timestamp: new Date().toISOString()
                };
                
                console.log('%c📞 NEW CONSULTATION REQUEST:', 'background: #5a189a; color: white; padding: 5px; border-radius: 3px;');
                console.table(formData);
                
                showToast('Request Sent!', 'We\'ll contact you within 24 hours.');
                closeModal('consultation-modal');
                this.reset();
            });
            
            document.getElementById('login-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('login-email').value;
                const password = document.getElementById('login-password').value;
                
                const result = authSystem.login(email, password);
                if (result.success) {
                    showToast('Welcome Back!', 'Successfully logged in.');
                    closeModal('login-modal');
                    updateSubmissionForm();
                } else {
                    showToast('Login Failed', result.error);
                }
            });
            
            document.getElementById('signup-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const userData = {
                    name: document.getElementById('signup-name').value,
                    email: document.getElementById('signup-email').value,
                    password: document.getElementById('signup-password').value,
                    userType: document.querySelector('input[name="user-type"]:checked')?.value
                };
                
                if (document.getElementById('signup-password').value !== document.getElementById('signup-confirm').value) {
                    showToast('Error', 'Passwords do not match');
                    return;
                }
                
                if (!document.getElementById('captcha').checked) {
                    showToast('Error', 'Please confirm you are not a robot');
                    return;
                }
                
                if (!document.getElementById('terms').checked) {
                    showToast('Error', 'Please accept the terms and conditions');
                    return;
                }
                
                const result = authSystem.signup(userData);
                if (result.success) {
                    showToast('Welcome to NØTE!', 'Your account has been created successfully.');
                    closeModal('signup-modal');
                    updateSubmissionForm();
                } else {
                    showToast('Signup Failed', result.error);
                }
            });
            
            document.getElementById('music-submission-form').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submissionData = {
                    name: authSystem.currentUser ? authSystem.currentUser.name : document.getElementById('submission-name').value,
                    email: authSystem.currentUser ? authSystem.currentUser.email : document.getElementById('submission-email').value,
                    artistName: document.getElementById('artist-name').value,
                    country: document.getElementById('country').value,
                    artistType: document.querySelector('input[name="artist-type"]:checked').value,
                    userType: authSystem.currentUser ? authSystem.currentUser.userType : 'guest',
                    songTitle: document.getElementById('song-title').value,
                    genre: document.getElementById('genre').value,
                    language: document.getElementById('language').value,
                    mood: document.getElementById('mood').value,
                    description: document.getElementById('description').value,
                    demoUrl: document.getElementById('demo-url').value,
                    lyrics: document.getElementById('lyrics').value,
                    submissionDate: new Date().toISOString(),
                    userId: authSystem.currentUser ? authSystem.currentUser.id : null
                };
                
                console.log('%c🎵 NEW SONG SUBMISSION RECEIVED:', 'background: #8a2be2; color: white; padding: 5px; border-radius: 3px; font-weight: bold;');
                console.log('📋 Submission Details:');
                console.log(`Name: ${submissionData.name}`);
                console.log(`Artist Type: ${submissionData.artistType === 'singer' ? 'Singer/Artist' : 'Regular User'}`);
                console.log(`Email: ${submissionData.email}`);
                console.log(`Song Title: ${submissionData.songTitle}`);
                console.log(`Demo URL: ${submissionData.demoUrl}`);
                console.log(`Genre: ${submissionData.genre}`);
                console.log('---');
                console.log('Full submission data:', submissionData);
                
                showToast('Demo Submitted!', 'Your song has been submitted for review. We\'ll contact you soon.');
                
                this.reset();
                updateSubmissionForm();
            });
            
            const signupPassword = document.getElementById('signup-password');
            if (signupPassword) {
                signupPassword.addEventListener('input', function() {
                    const password = this.value;
                    const rules = document.getElementById('password-rules');
                    rules.classList.remove('hidden');
                    
                    const updateRule = (ruleId, isValid) => {
                        const rule = document.getElementById(ruleId);
                        rule.className = `flex items-center text-sm ${isValid ? 'text-green-400' : 'text-red-400'}`;
                        rule.querySelector('i').className = `fas fa-${isValid ? 'check' : 'times'} mr-2`;
                    };
                    
                    updateRule('rule-length', password.length >= 8);
                    updateRule('rule-upper', /[A-Z]/.test(password));
                    updateRule('rule-lower', /[a-z]/.test(password));
                    updateRule('rule-number', /[0-9]/.test(password));
                    updateRule('rule-special', /[!@#$%^&*(),.?":{}|<>]/.test(password));
                });
            }
            
            window.addEventListener('scroll', () => {
                if (window.scrollY > 20) {
                    navbar.classList.add('glass-active');
                } else {
                    navbar.classList.remove('glass-active');
                }
            });
        }
        
        function loadTrack(index) {
            currentTrackIndex = index;
            const track = tracks[index];
            audioPlayer.src = track.src;
            nowPlayingImg.src = track.img;
            nowPlayingTitle.textContent = track.title;
            nowPlayingArtist.textContent = track.artist;
            durationEl.textContent = track.duration;
            
            audioPlayer.load();
        }
        
        function togglePlayPause() {
            if (isPlaying) {
                pauseTrack();
            } else {
                playTrack(currentTrackIndex);
            }
        }
        
        function playTrack(index) {
            if (index !== currentTrackIndex) {
                loadTrack(index);
            }
            
            audioPlayer.play().catch(error => {
                console.log('Audio playback failed:', error);
                showToast('Playback Error', 'Unable to play the track. Please try again.');
            });
            
            isPlaying = true;
            playPauseIcon.className = 'fas fa-pause';
            
            gsap.to(playPauseBtn, {
                scale: 1.1,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
        
        function pauseTrack() {
            audioPlayer.pause();
            isPlaying = false;
            playPauseIcon.className = 'fas fa-play';
            
            gsap.to(playPauseBtn, {
                scale: 0.9,
                duration: 0.2,
                yoyo: true,
                repeat: 1
            });
        }
        
        function playPrevTrack() {
            currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
            playTrack(currentTrackIndex);
        }
        
        function playNextTrack() {
            currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
            playTrack(currentTrackIndex);
        }
        
        function updateProgress() {
            if (isSeeking) return;
            
            const { currentTime, duration } = audioPlayer;
            const progressPercent = (currentTime / duration) * 100;
            
            progressBar.style.width = `${progressPercent}%`;
            seekBar.value = progressPercent;
            
            currentTimeEl.textContent = formatTime(currentTime);
            
            if (duration) {
                durationEl.textContent = formatTime(duration);
            }
        }
        
        function updateDuration() {
            const duration = audioPlayer.duration;
            if (duration) {
                durationEl.textContent = formatTime(duration);
            }
        }
        
        function formatTime(seconds) {
            if (isNaN(seconds) || !isFinite(seconds)) return "0:00";
            const mins = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
        }
        
        function showModal(modalId) {
            const modal = document.getElementById(modalId);
            modal.classList.add('active');
            gsap.fromTo(modal.querySelector('.modal-content'), 
                { scale: 0.9, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
            );
        }
        
        function closeModal(modalId) {
            const modal = document.getElementById(modalId);
            gsap.to(modal.querySelector('.modal-content'), {
                scale: 0.9,
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    modal.classList.remove('active');
                }
            });
        }
        
        function showLoginModal() {
            showModal('login-modal');
        }
        
        function showSignupModal() {
            showModal('signup-modal');
            closeModal('login-modal');
        }
        
        function showProfileModal() {
            loadProfileContent();
            showModal('profile-modal');
        }
        
        function loadProfileContent() {
            const profileContent = document.getElementById('profile-content');
            if (!authSystem.currentUser) return;
            
            const user = authSystem.currentUser;
            profileContent.innerHTML = `
                <div class="flex items-start space-x-6">
                    <div class="relative">
                        <div class="w-32 h-32 rounded-2xl overflow-hidden bg-gradient-to-br from-purple-900 to-purple-700 flex items-center justify-center">
                            ${user.profilePic ? 
                                `<img src="${user.profilePic}" alt="Profile" class="w-full h-full object-cover">` :
                                `<span class="text-white text-4xl font-black">${user.name.charAt(0)}</span>`
                            }
                        </div>
                        <button onclick="changeProfilePicture()" class="absolute bottom-2 right-2 w-10 h-10 rounded-full glass-effect flex items-center justify-center hover:bg-purple-900/30">
                            <i class="fas fa-camera text-white"></i>
                        </button>
                    </div>
                    
                    <div class="flex-grow">
                        <h3 class="text-2xl font-black mb-2">${user.name}</h3>
                        <p class="text-purple-400 mb-4">${user.userType === 'artist' ? '🎤 Singer / Artist' : '👤 Regular User'}</p>
                        <div class="space-y-3">
                            <div class="flex items-center">
                                <i class="fas fa-envelope text-purple-500 w-6 mr-3"></i>
                                <span class="text-gray-300">${user.email}</span>
                            </div>
                            <div class="flex items-center">
                                <i class="fas fa-calendar-alt text-purple-500 w-6 mr-3"></i>
                                <span class="text-gray-300">Joined ${new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-xl font-black mb-4">Update Profile</h4>
                    <form id="update-profile-form" class="space-y-4">
                        <div class="grid md:grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-300 mb-2">Full Name</label>
                                <input type="text" id="update-name" value="${user.name}" class="form-input">
                            </div>
                            <div>
                                <label class="block text-gray-300 mb-2">Email</label>
                                <input type="email" id="update-email" value="${user.email}" class="form-input">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-gray-300 mb-2">Artist Name (Optional)</label>
                            <input type="text" id="update-artist-name" value="${user.artistName || ''}" placeholder="Your stage name" class="form-input">
                        </div>
                        
                        <button type="submit" class="luxury-btn bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-600 hover:to-purple-800 text-white font-bold py-3 px-8 rounded-full">
                            Update Profile
                        </button>
                    </form>
                </div>
            `;
            
            document.getElementById('update-profile-form').addEventListener('submit', function(e) {
                e.preventDefault();
                const updates = {
                    name: document.getElementById('update-name').value,
                    email: document.getElementById('update-email').value,
                    artistName: document.getElementById('update-artist-name').value
                };
                
                if (authSystem.updateProfile(updates)) {
                    showToast('Profile Updated', 'Your profile has been updated successfully.');
                    updateSubmissionForm();
                }
            });
        }
        
        function changeProfilePicture() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(event) {
                        authSystem.updateProfile({ profilePic: event.target.result });
                        showToast('Profile Picture Updated', 'Your profile picture has been updated.');
                        setTimeout(loadProfileContent, 500);
                    };
                    reader.readAsDataURL(file);
                }
            };
            input.click();
        }
        
        function showToast(title, message) {
            const toast = document.getElementById('toast');
            document.getElementById('toast-title').textContent = title;
            document.getElementById('toast-message').textContent = message;
            
            toast.classList.remove('hidden');
            
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 3000);
        }
        
        function updateSubmissionForm() {
            if (authSystem.currentUser) {
                document.getElementById('submission-name').value = authSystem.currentUser.name;
                document.getElementById('submission-email').value = authSystem.currentUser.email;
                
                if (authSystem.currentUser.userType === 'artist') {
                    document.querySelector('input[name="artist-type"][value="singer"]').checked = true;
                } else {
                    document.querySelector('input[name="artist-type"][value="regular"]').checked = true;
                }
            }
        }
        
        document.addEventListener('DOMContentLoaded', init);