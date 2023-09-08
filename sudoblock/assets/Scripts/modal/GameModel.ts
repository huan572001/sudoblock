import { _decorator, Camera, CCInteger, Component, Node, Prefab } from "cc";
const { ccclass, property } = _decorator;

@ccclass("GameModel")
export class GameModel extends Component {
  @property({ type: Prefab })
  private gridSquare: Prefab;

  @property({ type: Prefab })
  private gridBlock: Prefab;

  @property({ type: Node })
  private gridBlockContainer: Node;

  @property({ type: Camera })
  private gameCamera: Camera;

  @property({ type: CCInteger })
  private Point: number;
  public get point(): number {
    return this.Point;
  }
  public set point(value: number) {
    this.Point = value;
  }

  public get GridSquare(): Prefab {
    return this.gridSquare;
  }

  public set GridSquare(gridSquare: Prefab) {
    this.gridSquare = gridSquare;
  }

  public get GridBlock(): Prefab {
    return this.gridBlock;
  }

  public set GridBlock(gridBlock: Prefab) {
    this.gridBlock = gridBlock;
  }

  public get GridBlockContainer(): Node {
    return this.gridBlockContainer;
  }

  public set GridBlockContainer(gridBlockContainer: Node) {
    this.gridBlockContainer = gridBlockContainer;
  }

  public get GameCamera(): Camera {
    return this.gameCamera;
  }

  public set GameCamera(gameCamera: Camera) {
    this.gameCamera = gameCamera;
  }

  start() {}

  update(deltaTime: number) {}
}
