import { _decorator, AudioSource, Component, Node } from "cc";
import { AudioMusic, AudioSound } from "../constans";
import { LocalData } from "../localData";
const { ccclass, property } = _decorator;

@ccclass("AudioController")
export class AudioController extends Component {
  @property({ type: AudioSource })
  private click: AudioSource;
  @property({ type: AudioSource })
  private bup: AudioSource;
  @property({ type: AudioSource })
  private firstCombo: AudioSource;
  @property({ type: AudioSource })
  private bigCombo: AudioSource;
  @property({ type: AudioSource })
  private bg: AudioSource;

  protected start(): void {
    let audio = "1";
    let audioMusic = "1";
    try {
      audio = localStorage.getItem(AudioSound);
      audioMusic = localStorage.getItem(AudioMusic);
    } catch (error) {
      audio = LocalData.AudioSound;
      audioMusic = LocalData.AudioMusic;
    }

    if (audio) {
      if (audio === "1") {
        this.onAudio();
      } else {
        this.offAudio();
      }
    }
    if (audioMusic) {
      if (audioMusic === "1") {
        this.onPlaybg();
      } else {
        this.offPlaybg();
      }
    }
  }
  public onPlayClick(): void {
    this.click.play();
  }
  public onPlayBup(): void {
    this.bup.play();
  }
  public onPlayFirstCombo(): void {
    this.firstCombo.play();
  }
  public onPlayBigCombo(): void {
    this.bigCombo.play();
  }
  public onPlaybg(): void {
    try {
      localStorage.setItem(AudioMusic, "1");
    } catch (error) {
      LocalData.AudioMusic = "1";
    }
    this.bg.volume = 1;
  }
  public offPlaybg(): void {
    try {
      localStorage.setItem(AudioMusic, "0");
    } catch (error) {
      LocalData.AudioMusic = "0";
    }

    this.bg.volume = 0;
  }
  public offAudio(): void {
    try {
      localStorage.setItem(AudioSound, "0");
    } catch (error) {
      LocalData.AudioSound = "0";
    }
    this.click.volume = 0;
    this.bup.volume = 0;
    this.firstCombo.volume = 0;
    this.bigCombo.volume = 0;
  }
  public onAudio(): void {
    try {
      localStorage.setItem(AudioSound, "1");
    } catch (error) {
      LocalData.AudioSound = "1";
    }
    this.click.volume = 1;
    this.bup.volume = 1;
    this.firstCombo.volume = 1;
    this.bigCombo.volume = 1;
  }
}
