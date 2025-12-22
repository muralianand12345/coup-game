type SoundType = 'coin' | 'card' | 'challenge' | 'block' | 'eliminate' | 'turn' | 'win' | 'lose' | 'click';

class AudioManager {
	private enabled: boolean = true;

	constructor() {
		this.loadFromStorage();
	}

	private loadFromStorage = () => {
		const stored = localStorage.getItem('coup-sound-enabled');
		this.enabled = stored !== 'false';
	};

	private getAudioContext = (): AudioContext | null => {
		try {
			return new (window.AudioContext || (window as any).webkitAudioContext)();
		} catch {
			return null;
		}
	};

	private createTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
		const ctx = this.getAudioContext();
		if (!ctx) return;

		const oscillator = ctx.createOscillator();
		const gainNode = ctx.createGain();

		oscillator.connect(gainNode);
		gainNode.connect(ctx.destination);

		oscillator.frequency.value = frequency;
		oscillator.type = type;

		gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
		gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);

		oscillator.start(ctx.currentTime);
		oscillator.stop(ctx.currentTime + duration);
	};

	play = (sound: SoundType) => {
		if (!this.enabled) return;

		switch (sound) {
			case 'coin':
				this.createTone(800, 0.1, 'sine');
				setTimeout(() => this.createTone(1000, 0.15, 'sine'), 50);
				break;
			case 'card':
				this.createTone(300, 0.08, 'triangle');
				break;
			case 'challenge':
				this.createTone(400, 0.1, 'sawtooth');
				setTimeout(() => this.createTone(600, 0.15, 'sawtooth'), 100);
				break;
			case 'block':
				this.createTone(250, 0.15, 'square');
				break;
			case 'eliminate':
				this.createTone(200, 0.3, 'sawtooth');
				setTimeout(() => this.createTone(150, 0.3, 'sawtooth'), 150);
				break;
			case 'turn':
				this.createTone(600, 0.1, 'sine');
				break;
			case 'win':
				[523, 659, 784, 1047].forEach((freq, i) => setTimeout(() => this.createTone(freq, 0.2, 'sine'), i * 150));
				break;
			case 'lose':
				[400, 350, 300, 250].forEach((freq, i) => setTimeout(() => this.createTone(freq, 0.25, 'sine'), i * 200));
				break;
			case 'click':
				this.createTone(500, 0.05, 'sine');
				break;
		}
	};

	toggle = () => {
		this.enabled = !this.enabled;
		localStorage.setItem('coup-sound-enabled', String(this.enabled));
		if (this.enabled) this.play('click');
		return this.enabled;
	};

	isEnabled = () => this.enabled;
}

export const audioManager = new AudioManager();
