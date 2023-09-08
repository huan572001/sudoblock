import { _decorator, Button, Component, director, find, Node } from "cc";
import { MenuModel } from "../modal/MenuModel";
import { MenuView } from "../view/MenuView";
import { Game } from "../constans";
import GameClient from "@onechaintech/gamesdk-dev";
import { StoreApi } from "../StoreApi";
const { ccclass, property } = _decorator;

@ccclass("MenuController")
export class MenuController extends Component {
  @property({ type: MenuModel })
  private MenuModel: MenuModel;

  @property({ type: MenuView })
  private MenuView: MenuView;

  private parameters: Node;
  private statusLoadding: boolean = false;
  public gameClient;
  async start() {
    director.resume();

    await this.callDataApi();
  }

  update(deltaTime: number) {}

  private async clickPlayGame(button: Button) {
    if (!this.statusLoadding) {
      this.statusLoadding = true;
      this.MenuView.onLoadding();
      await this.gameClient.match
        .startMatch()
        .then((data) => {
          // this.matchId = data.matchId;
          this.parameters.getComponent(StoreApi).matchId = data.matchId;
        })
        .catch((error) => {
          console.log(error);
        });
      this.statusLoadding = false;
      director.addPersistRootNode(this.parameters);
      director.loadScene(Game);
    }
  }
  private async callDataApi() {
    this.parameters = find("GameClient");
    let userId: any;
    if (this.parameters === null) {
      this.statusLoadding = true;
      this.MenuView.onLoadding();
      this.parameters = new Node("GameClient");
      if (this.gameClient === undefined) {
        this.gameClient = new GameClient(
          "64bf4e6c798ddd0f4a2da0e6",
          "eefdf7c8-a562-4780-9231-a86d0d613729",
          window.parent,
          { dev: true }
        );
        await this.gameClient
          .initAsync()
          .then(() => {
            userId = this.gameClient.user.citizen.getSaId();
            this.statusLoadding = false;
          })
          .catch((err) => console.log(err));
        try {
          if (localStorage.getItem("userId")) {
            if (localStorage.getItem("userId") !== userId) {
              localStorage.clear();
            }
          }
          localStorage.setItem("userId", userId);
        } catch (error) {}
      }
      this.MenuView.offLoadding();
      let gameClientParams = this.parameters.addComponent(StoreApi);
      gameClientParams.gameClient = this.gameClient;
    } else {
      this.gameClient = this.parameters.getComponent(StoreApi).gameClient;
    }
  }
}
