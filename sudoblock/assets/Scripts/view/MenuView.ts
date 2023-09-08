import { _decorator, Animation, Component, Node } from "cc";
import { AudioMusic, AudioSound } from "../constans";
import { LocalData } from "../localData";
const { ccclass, property } = _decorator;

@ccclass("MenuView")
export class MenuView extends Component {
  @property({ type: Node })
  private settingNode: Node;

  @property({ type: Node })
  private openSoursh: Node;

  @property({ type: Node })
  private closeSoursh: Node;

  @property({ type: Node })
  private openMusic: Node;

  @property({ type: Node })
  private closeMusic: Node;

  @property({ type: Node })
  private Loadding: Node;
  start() {
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
        this.onSound();
      } else {
        this.offSound();
      }
    }
    if (audioMusic) {
      if (audioMusic === "1") {
        this.onMusic();
      } else {
        this.offMusic();
      }
    }
  }

  update(deltaTime: number) {}
  public onSetting(): void {
    this.settingNode.setPosition(0, 0);
  }
  public offSetting(): void {
    this.settingNode.setPosition(1000, 1000);
  }
  public onSound(): void {
    this.openSoursh.active = true;
    this.closeSoursh.active = false;
  }
  public offSound(): void {
    this.openSoursh.active = false;
    this.closeSoursh.active = true;
  }
  public onMusic(): void {
    this.openMusic.active = true;
    this.closeMusic.active = false;
  }
  public offMusic(): void {
    this.openMusic.active = false;
    this.closeMusic.active = true;
  }
  public onLoadding(): void {
    this.Loadding.setPosition(0, 0);
  }
  public offLoadding(): void {
    this.Loadding.setPosition(10000, 10000);
  }
}
