import {
  _decorator,
  Animation,
  Color,
  Component,
  instantiate,
  Label,
  Node,
  Prefab,
  Sprite,
  SpriteFrame,
  UITransform,
  Vec2,
  Vec3,
} from "cc";
import { AudioMusic, AudioSound, dataOll, HightPoint } from "../constans";
import { LocalData } from "../localData";
const { ccclass, property } = _decorator;
@ccclass("GameView")
export class GameView extends Component {
  @property({ type: Node })
  private gridNode: Node;

  @property({ type: [SpriteFrame] })
  private gridSprite: SpriteFrame[] = [];

  @property({ type: [Node] })
  private gridBlockNode: Node[] = [];

  @property({ type: Prefab })
  private gridSquare: Prefab;

  @property({ type: Label })
  private point: Label;

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
  private offBlock: Node;

  @property({ type: Label })
  private hightPoint: Label;

  @property({ type: Label })
  private pointEAT: Label;

  @property({ type: Animation })
  private pointEATAnim: Animation;
  private arrBlock: Node[][] = [];
  private arrNewBlock: Node[][] = [];
  private gridSize: number = 40;
  private squareIndex: number = 0;
  private gridRow: number = 9;
  private gridCol: number = 9;
  private arrOll: dataOll = null;
  public set GridBlockNode(gridBlockNode: Node[]) {
    this.gridBlockNode = gridBlockNode;
  }
  public get GridBlockNode(): Node[] {
    return this.gridBlockNode;
  }

  protected start(): void {
    let audio: string = "1";
    let audioMusic: string = "1";

    try {
      audio = localStorage.getItem(AudioSound);
      audioMusic = localStorage.getItem(AudioMusic);
      this.hightPoint.string = localStorage.getItem(HightPoint)
        ? localStorage.getItem(HightPoint)
        : "0";
    } catch (error) {
      audio = LocalData.AudioSound;
      audioMusic = LocalData.AudioMusic;
      this.hightPoint.string = LocalData.HightPoint.toString();
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
  public offNewBlock(): void {
    this.offBlock.setPosition(380, 0);
  }
  public innitNewBlock(): void {
    for (let i = 0; i < this.GridBlockNode.length; i++) {
      this.arrNewBlock.push([]);
      for (let j = 0; j < 5; j++) {
        let newBlock = instantiate(this.gridSquare);
        newBlock.getComponent(Sprite).spriteFrame = this.gridSprite[2];
        this.GridBlockNode[i].addChild(newBlock);
        this.arrNewBlock[i].push(newBlock);
      }
    }
  }

  public createBlock(arr: number[][], index: number): void {
    let st = new Vec2(0, 0);
    let vt = 0;
    for (let i = 0; i < 5; i++) {
      if (i === 0) {
        st.y = 40;
      }
      for (let j = 0; j < 5; j++) {
        if (j === 0) {
          st.x = -40;
        }
        if (arr[i][j] === 1) {
          this.arrNewBlock[index][vt]
            .getComponent(UITransform)
            .setContentSize(20, 20);
          this.arrNewBlock[index][vt].setPosition(st.x, st.y);
          vt++;
        }
        st.x += 20;
      }
      st.y -= 20;
    }
    let tmp = vt;
    for (let i = 0; i < 5 - vt; i++) {
      this.arrNewBlock[index][tmp].setPosition(10000, 10000);
      tmp++;
    }
  }
  public spawnGridSquares(GridSquare): void {
    //0, 1, 2, 3, 4,
    //5, 6, 7, 8, 9
    for (let row = 0; row < this.gridRow; row++) {
      this.arrBlock.push([]);
      for (let col = 0; col < this.gridCol; col++) {
        let squaredGrid = instantiate(GridSquare);
        this.gridNode.addChild(squaredGrid);
        this.arrBlock[row].push(squaredGrid);
        squaredGrid.position = new Vec3(
          (-this.gridRow / 2 + col + 0.5) * this.gridSize,
          (this.gridCol / 2 - row - 0.5) * this.gridSize,
          0
        );
        if (this.squareIndex % 2 === 0) {
          squaredGrid.getComponent(Sprite).spriteFrame = this.gridSprite[0];
        } else if (this.squareIndex % 2 === 1) {
          squaredGrid.getComponent(Sprite).spriteFrame = this.gridSprite[0];
          squaredGrid.getComponent(Sprite).color = new Color("#E8D0FA");
        }
        this.squareIndex++;
      }
    }
  }
  public setMap(arr: number[][]): void {
    for (let row = 0; row < this.gridRow; row++) {
      for (let col = 0; col < this.gridCol; col++) {
        if (arr[row][col] === 1) {
          this.arrBlock[row][col]
            .getChildByName("img")
            .getComponent(Sprite).spriteFrame = this.gridSprite[2];
          this.arrBlock[row][col]
            .getChildByName("img")
            .getComponent(UITransform)
            .setContentSize(40, 40);
        } else {
          this.arrBlock[row][col]
            .getChildByName("img")
            .getComponent(Sprite).spriteFrame = null;
        }
      }
    }
  }
  public onDisableBlock(index: number): void {
    for (let i = 0; i < this.arrNewBlock[index].length; i++) {
      this.arrNewBlock[index][i].getComponent(Sprite).color = new Color(
        "#0505057B"
      );
    }
  }
  public offDisableBlock(): void {
    for (let i = 0; i < this.arrNewBlock.length; i++) {
      for (let j = 0; j < this.arrNewBlock[i].length; j++) {
        this.arrNewBlock[i][j].getComponent(Sprite).color = new Color(
          "#FFFFFF"
        );
      }
    }
  }
  public onHightlight(x: number, y: number, arr: number[][]): void {
    this.offHightlight();
    let a = 0;
    let b = 0;
    this.arrOll = {
      arr: arr,
      x: x,
      y: y,
    };
    for (let i = x - 2; i <= x + 2; i++) {
      b = 0;
      for (let j = y - 2; j <= y + 2; j++) {
        if (i < 0 || j < 0 || i > 8 || j > 8) {
        } else {
          if (arr[a][b] === 1) {
            this.arrBlock[i][j]
              .getChildByName("img")
              .getComponent(Sprite).spriteFrame = this.gridSprite[3];
            this.arrBlock[i][j]
              .getChildByName("img")
              .getComponent(Sprite).color = new Color("#7E7E7EA3");
            this.arrBlock[i][j]
              .getChildByName("img")
              .getComponent(UITransform)
              .setContentSize(40, 40);
          }
        }
        b++;
      }
      a++;
    }
  }
  public offHightlight(): void {
    if (this.arrOll !== null) {
      let a = 0;
      let b = 0;
      for (let i = this.arrOll.x - 2; i <= this.arrOll.x + 2; i++) {
        b = 0;
        for (let j = this.arrOll.y - 2; j <= this.arrOll.y + 2; j++) {
          if (i < 0 || j < 0 || i > 8 || j > 8) {
          } else {
            if (this.arrOll.arr[a][b] === 1) {
              this.arrBlock[i][j]
                .getChildByName("img")
                .getComponent(Sprite).spriteFrame = null;
              this.arrBlock[i][j]
                .getChildByName("img")
                .getComponent(Sprite).color = new Color("#ffffff");
            }
          }
          b++;
        }
        a++;
      }
      this.arrOll = null;
    }
  }
  public setPoint(point: number): void {
    this.point.string = `${point}`;
  }
  public onDissable(index: number): void {
    this.arrNewBlock[index].forEach((e) => {
      e.getChildByName("img").getComponent(Sprite).spriteFrame =
        this.gridSprite[4];
      e.getChildByName("img").getComponent(UITransform).setContentSize(20, 20);
    });
  }
  public offDissable(): void {
    for (let i = 0; i < this.arrNewBlock.length; i++) {
      this.arrNewBlock[i].forEach((e) => {
        e.getChildByName("img").getComponent(Sprite).spriteFrame =
          this.gridSprite[2];
        e.getChildByName("img")
          .getComponent(UITransform)
          .setContentSize(20, 20);
      });
    }
  }
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
  public onAnimEat(x: number, y: number): void {
    this.arrBlock[x][y].getComponent(Animation).play();
  }

  public async onAnimPoint(pointOll: number, point: number) {
    // for (let i = pointOll; i <= point; i++) {
    let tmp = point / 5 - 1;
    let time = 0.5 / tmp;
    this.schedule(
      () => {
        pointOll += 5;
        this.point.string = `${Math.floor(pointOll)}`;
      },
      0,
      tmp,
      time
    );
    this.pointEAT.string = `+${Math.floor(point)}`;
    // }

    this.pointEATAnim.play();
  }
}
