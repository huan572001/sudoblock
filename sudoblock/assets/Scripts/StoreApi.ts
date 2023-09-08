import { _decorator, Component, Node } from "cc";
const { ccclass, property } = _decorator;

@ccclass("StoreApi")
export class StoreApi extends Component {
  public gameClient;
  public matchId: string;
  start() {}

  update(deltaTime: number) {}
}
