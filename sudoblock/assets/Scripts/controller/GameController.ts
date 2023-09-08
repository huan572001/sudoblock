import {
  _decorator,
  Component,
  Node,
  Vec2,
  instantiate,
  Vec3,
  Sprite,
  randomRangeInt,
  EventTouch,
  EventMouse,
  director,
  find,
  Input,
  view,
} from "cc";

import { GameModel } from "../modal/GameModel";
import { GameView } from "../view/GameView";
import { Data } from "../DataSquares";
import { GameOverView } from "../view/GameOverView";
import { Game, HightPoint, Home } from "../constans";
import { AudioController } from "./AudioController";
import { StoreApi } from "../StoreApi";
import { LocalData } from "../localData";
const { ccclass, property } = _decorator;

@ccclass("GameController")
export class GameController extends Component {
  @property({ type: GameModel })
  private GameModel: GameModel;

  @property({ type: GameView })
  private GameView: GameView;

  @property({ type: GameOverView })
  private GameOverView: GameOverView;

  @property({ type: AudioController })
  private audioGame: AudioController;

  @property({ type: Node })
  private gird: Node;

  private gridRow: number = 9;
  private gridCol: number = 9;
  private startMousePos: Vec3;
  private blockIndex: number = 0;
  private randType: number;
  private randBlock: number;
  private startBlockPos: Vec3;
  private isDrag: boolean = false;
  private arrGame: number[][] = [];
  private indexBlock: number = null;
  private indexBlockPick: number;
  private arrNewBlock: number[][][] = [];
  private statusBlock: boolean[] = [true, true, true];
  private point: number = 0;
  private checkCombo: number = 0;
  private pointCombo: number = 1;
  private statusTouchMove: boolean = false;
  private statusTouchStart: boolean = false;
  private nodeMove: Node;
  // private gameClient: StoreApi;
  private statusLoadding: boolean = false;

  protected onLoad(): void {}
  protected start(): void {
    this.innitMap();
    this.GameView.innitNewBlock();
    this.GameView.spawnGridSquares(this.GameModel.GridSquare);
    this.spawnNewBlock();
    this.onTouch();
    this.gird.on(Input.EventType.MOUSE_UP, (e) => this.onInputStart(e));
  }
  private onInputStart(e: EventMouse): void {
    if (this.statusTouchMove) {
      this.defaultBlock();
    }
  }
  private defaultBlock(): void {
    this.statusTouchMove = false;
    this.nodeMove.position = new Vec3(this.startBlockPos);
    this.nodeMove.setScale(1, 1);
  }
  private onTouch(): void {
    const selectedNodes = this.GameView.GridBlockNode.slice(0, 3);
    selectedNodes.forEach((node) => (node.active = true));
    selectedNodes.forEach((node, index) => {
      node.on(
        Node.EventType.TOUCH_START,
        (event) => {
          if (this.statusBlock[index]) this.onTouchStart(event, node, index);
        },
        this
      );
      node.on(
        Node.EventType.TOUCH_MOVE,
        (event) => {
          if (this.statusBlock[index]) this.onTouchMove(event, node);
        },
        this
      );
      node.on(
        Node.EventType.TOUCH_END,
        (event) => {
          if (this.statusBlock[index]) this.onTouchEnd(event, node, index);
        },
        this
      );
    });
    // this.onMouseGird();
  }
  private onMouseGird(): void {
    this.gird.on(
      Node.EventType.MOUSE_UP,
      (event) => {
        this.onTouchEndGird(event);
      },
      this.gird
    );
    this.gird.on(
      Node.EventType.MOUSE_MOVE,
      (event) => {
        this.onTouchMoveGird(event);
      },
      this.gird
    );
    this.gird.on(
      Node.EventType.TOUCH_START,
      (event) => {
        this.onTouchstartGird(event);
      },
      this.gird
    );
  }
  private offMouseGird(): void {
    this.gird.off(
      Node.EventType.MOUSE_UP,
      (event) => {
        this.onTouchEndGird(event);
      },
      this.gird
    );
    this.gird.off(
      Node.EventType.MOUSE_MOVE,
      (event) => {
        this.onTouchMoveGird(event);
      },
      this.gird
    );
    this.gird.off(
      Node.EventType.TOUCH_START,
      (event) => {
        this.onTouchstartGird(event);
      },
      this.gird
    );
  }
  private innitMap(): void {
    for (let i = 0; i < this.gridRow; i++) {
      this.arrGame.push([]);
      for (let j = 0; j < this.gridCol; j++) {
        this.arrGame[i].push(0);
      }
    }
  }

  private spawnNewBlock(): void {
    for (let i = 0; i < this.GameView.GridBlockNode.length; i++) {
      this.randomNum();
      this.arrNewBlock.push(Data[this.randType].squares[this.randBlock]);
      this.GameView.createBlock(Data[this.randType].squares[this.randBlock], i);
      this.blockIndex++;
    }
  }

  private randomNum(): void {
    this.randType = randomRangeInt(0, 5);
    let max = Data[this.randType].squares.length - 1;
    this.randBlock = randomRangeInt(0, max);
  }

  private onTouchStart(event: EventTouch, node: Node, index: number) {
    if (!this.statusTouchMove) {
      this.statusTouchStart = true;
      this.nodeMove = node;
      this.startBlockPos = node.position.clone();
      this.isDrag = true;
      node.setScale(2, 2);
      this.indexBlockPick = index;
    } else {
      this.defaultBlock();
    }
  }

  private onTouchMove(event: EventTouch, node: Node) {
    // if (
    //   event.getLocation().x < -830 ||
    //   event.getLocation().x > 70 ||
    //   event.getLocation().y < -260 ||
    //   event.getLocation().y > 260
    // ) {
    //   this.defaultBlock();
    // } else
    let mouse;
    if (this.statusTouchStart && node === this.nodeMove) {
      node.setScale(2, 2);

      mouse = this.GameModel.GameCamera.screenToWorld(
        new Vec3(event.getLocation().x, event.getLocation().y, 0)
      );
      let newPos = new Vec3();
      newPos = this.GameModel.GridBlockContainer.inverseTransformPoint(
        newPos,
        mouse
      );
      this.statusTouchMove = true;
      if (
        newPos.x < -830 ||
        newPos.x > 70 ||
        newPos.y < -260 ||
        newPos.y > 260
      ) {
        this.defaultBlock();
        // this.offMouseGird();
      } else if (this.isDrag === true) {
        this.onMouseGird();
        this.startMousePos = mouse;
        node.position = new Vec3(newPos.x, newPos.y, 0);
      }
      // if(this.checkApro())
    }
  }

  private onTouchEnd(event: EventTouch, node: Node, index: number) {
    if (this.nodeMove === node) {
      this.statusTouchStart = false;
      this.statusTouchMove = false;
      this.indexBlock = index;
      this.indexBlockPick = null;
      this.isDrag = false; // location on UI space
      node.setScale(1, 1);
      node.position = new Vec3(this.startBlockPos);
    }
  }
  private onTouchstartGird(event: EventTouch): void {
    this.indexBlock = null;
  }
  private onTouchMoveGird(event: EventMouse) {
    if (this.isDrag && this.statusTouchMove) {
      this.startMousePos = this.GameModel.GameCamera.screenToWorld(
        new Vec3(event.getLocation().x, event.getLocation().y, 0)
      );
      let newPos = new Vec3();
      newPos = this.gird.inverseTransformPoint(newPos, this.startMousePos);
      let x = Math.floor((newPos.x + 360 / 2) / 40);
      let y = -Math.floor((newPos.y - 360 / 2) / 40) - 1;
      if (this.checkApro(y, x, this.indexBlockPick)) {
        this.GameView.onHightlight(y, x, this.arrNewBlock[this.indexBlockPick]);
      } else {
        this.GameView.offHightlight();
      }
    }
  }
  private onTouchEndGird(event: EventMouse) {
    if (this.indexBlock !== null) {
      this.startMousePos = this.GameModel.GameCamera.screenToWorld(
        new Vec3(event.getLocation().x, event.getLocation().y, 0)
      );
      let newPos = new Vec3();
      newPos = this.gird.inverseTransformPoint(newPos, this.startMousePos);
      let x = Math.floor((newPos.x + 360 / 2) / 40);
      let y = -Math.floor((newPos.y - 360 / 2) / 40) - 1;
      if (x >= 0 && x < 9 && y >= 0 && y < 9) {
        this.checkBlock(y, x);
      }
    }
  }
  private checkBlock(x: number, y: number) {
    let a = 0;
    let b = 0;
    let tmp: number[][] = [];

    let numBlock = this.countBlock(this.arrNewBlock[this.indexBlock]);
    for (let i = 0; i < this.arrGame.length; i++) {
      tmp.push([]);
      for (let j = 0; j < this.arrGame.length; j++) {
        tmp[i].push(this.arrGame[i][j]);
      }
    }
    for (let i = x - 2; i <= x + 2; i++) {
      b = 0;
      for (let j = y - 2; j <= y + 2; j++) {
        if (i < 0 || j < 0 || i > 8 || j > 8) {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            return;
          }
        } else {
          if (this.arrNewBlock[this.indexBlock][a][b] === 1) {
            if (tmp[i][j] === 0) {
              tmp[i][j] = 1;
            } else {
              return;
            }
          }
        }
        b++;
      }
      a++;
    }
    this.audioGame.onPlayBup();
    this.arrGame = tmp;
    this.statusBlock[this.indexBlock] = false;
    this.GameView.onDisableBlock(this.indexBlock);
    this.checkResetBlock();
    this.updateNewBlock();
    this.GameView.createBlock(
      this.arrNewBlock[this.indexBlock],
      this.indexBlock
    );
    this.indexBlock = null;
    this.GameView.offHightlight();

    this.GameView.setMap(this.arrGame);
    this.checkEAT(numBlock);
    if (this.checkLose()) {
      this.gameOver();
    }
  }
  private async gameOver() {
    let gameClient = find("GameClient").getComponent(StoreApi);
    this.GameOverView.onGameOver();
    this.GameOverView.setNewPoint(this.point);
    let hightPoint: number = 0;
    this.GameView.offNewBlock();
    try {
      hightPoint = localStorage.getItem(HightPoint)
        ? Number(localStorage.getItem(HightPoint))
        : 0;
    } catch (error) {
      hightPoint = LocalData.HightPoint;
    }

    if (this.point > hightPoint) {
      this.GameOverView.setPointHight(this.point);
      await gameClient.gameClient.match
        .completeMatch(gameClient.matchId, {
          score: this.point,
        })
        .then((data) => {})
        .catch((error) => console.log(error));
    }
  }
  private checkResetBlock(): void {
    for (let i = 0; i < this.statusBlock.length; i++) {
      if (this.statusBlock[i] === true) {
        return;
      }
    }
    this.statusBlock = [true, true, true];
    this.GameView.offDisableBlock();
  }
  private updateNewBlock() {
    this.randomNum();
    this.arrNewBlock[this.indexBlock] =
      Data[this.randType].squares[this.randBlock];
  }
  private checkEAT(numBlock: number): void {
    let tmp: number[][] = [];
    let a = 0;
    let point = 0;
    let status = false;
    for (let i = 0; i < this.gridRow; i++) {
      tmp.push([]);
      for (let j = 0; j < this.gridCol; j++) {
        tmp[i].push(0);
      }
    }
    for (let i = 0; i < this.arrGame.length; i++) {
      a = 0;
      for (let j = 0; j < this.arrGame[i].length; j++) {
        if (this.arrGame[i][j] === 0) {
          break;
        }
        a++;
      }
      if (a === 9) {
        for (let k = 0; k < 9; k++) {
          tmp[i][k] = 1;
        }
        status = true;
        point += 1;
      }
    }
    for (let i = 0; i < this.arrGame.length; i++) {
      a = 0;
      for (let j = 0; j < this.arrGame[i].length; j++) {
        if (this.arrGame[j][i] === 0) {
          break;
        }
        a++;
      }
      if (a === 9) {
        for (let k = 0; k < 9; k++) {
          tmp[k][i] = 1;
        }
        status = true;
        point += 1;
      }
    }
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.D3x3(i, j)) {
          for (let k = i * 3; k < i * 3 + 3; k++) {
            for (let l = j * 3; l < j * 3 + 3; l++) {
              tmp[k][l] = 1;
            }
          }
          status = true;
          point += 1;
        }
      }
    }
    if (this.checkCombo === 0) {
      this.pointCombo = 1;
    }
    this.checkCombo--;
    if (status) {
      let pointEAT = 0;
      if (point === 1) {
        this.audioGame.onPlayFirstCombo();
      } else {
        this.audioGame.onPlayBigCombo();
      }
      while (point > 0) {
        pointEAT += point * this.GameModel.point * 9 * this.pointCombo;
        point -= 1;
      }
      pointEAT += numBlock * this.GameModel.point;
      this.GameView.onAnimPoint(this.point, pointEAT);
      this.point += pointEAT;
      for (let i = 0; i < this.arrGame.length; i++) {
        for (let j = 0; j < this.arrGame[i].length; j++) {
          if (tmp[i][j] === 1) {
            this.arrGame[i][j] = 0;
            this.GameView.onAnimEat(i, j);
          }
        }
      }
      this.scheduleOnce(() => {
        this.GameView.setMap(this.arrGame);
        this.GameView.setPoint(this.point);
      }, 0.5);
      this.pointCombo++;
      this.checkCombo = 3;
    } else {
      this.GameView.onAnimPoint(this.point, numBlock * this.GameModel.point);
      this.point += numBlock * this.GameModel.point;
    }
  }
  private D3x3(i: number, j: number): boolean {
    for (let k = i * 3; k < i * 3 + 3; k++) {
      for (let l = j * 3; l < j * 3 + 3; l++) {
        if (this.arrGame[k][l] === 0) {
          return false;
        }
      }
    }
    return true;
  }
  private checkLose(): boolean {
    let count: number = 0;
    this.GameView.offDissable();
    for (let a = 0; a < this.arrNewBlock.length; a++) {
      if (this.statusBlock[a]) {
        if (this.browseLose(a)) {
          this.GameView.onDissable(a);
        } else {
          count++;
        }
      }
    }
    if (count > 0) return false;
    return true;
  }
  private browseLose(a: number): boolean {
    for (let i = 0; i < this.arrGame.length; i++) {
      for (let j = 0; j < this.arrGame.length; j++) {
        if (this.arrGame[i][j] === 0) {
          if (this.checkApro(i, j, a)) {
            return false;
          }
        }
      }
    }
    return true;
  }
  private checkApro(i: number, j: number, index: number): boolean {
    let a = 0;
    let b = 0;
    for (let k = i - 2; k <= i + 2; k++) {
      b = 0;
      for (let l = j - 2; l <= j + 2; l++) {
        if (k < 0 || l < 0 || k > 8 || l > 8) {
          if (this.arrNewBlock[index][a][b] === 1) {
            return false;
          }
        } else {
          if (this.arrNewBlock[index][a][b] === 1) {
            if (this.arrGame[k][l] !== 0) {
              return false;
            }
          }
        }
        b++;
      }
      a++;
    }
    return true;
  }
  private countBlock(arr: number[][]): number {
    let count = 0;
    arr.forEach((element) => {
      element.forEach((e) => {
        if (e === 1) {
          count += 1;
        }
      });
    });
    return count;
  }
  private onHome(): void {
    director.loadScene(Home);
  }
  private async resetGame() {
    if (!this.statusLoadding) {
      this.statusLoadding = true;
      let gameClient = find("GameClient").getComponent(StoreApi);
      await gameClient.gameClient.match
        .startMatch()
        .then((data) => {
          gameClient.matchId = data.matchId;
        })
        .catch((error) => console.log(error));
      director.loadScene(Game);
    }
  }
}
