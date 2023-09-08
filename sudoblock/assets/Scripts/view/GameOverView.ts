import { _decorator, Component, director, Label, Node } from "cc";
import { Game, HightPoint } from "../constans";
import { LocalData } from "../localData";
const { ccclass, property } = _decorator;

@ccclass("GameOverView")
export class GameOverView extends Component {
  @property({ type: Label })
  private pointNew: Label;
  @property({ type: Label })
  private pointHight: Label;
  @property({ type: Node })
  private gameOver: Node;

  protected start(): void {
    try {
      this.pointHight.string = localStorage.getItem(HightPoint)
        ? localStorage.getItem(HightPoint)
        : "0";
    } catch (error) {
      this.pointHight.string = LocalData.HightPoint.toString();
    }
  }
  public setNewPoint(point: number): void {
    this.pointNew.string = `${point}`;
  }
  public setPointHight(point: number): void {
    try {
      localStorage.setItem(HightPoint, point.toString());
    } catch (error) {
      LocalData.HightPoint = point;
    }
    this.pointHight.string = point.toString();
  }
  public onGameOver(): void {
    this.gameOver.setPosition(0, 0);
  }
  public offGameOver(): void {
    this.gameOver.setPosition(10000, 10000);
  }
}
