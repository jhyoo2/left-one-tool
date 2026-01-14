import { Client } from "@heroiclabs/nakama-js";

const useSSL = false;
const host = "www.chamelio.kr";
const client = new Client("defaultkey", host, "7650", useSSL);
const email = "jhyoo89591@gmail.com";
const password = "Vmflxkdla1!";

function xorConvert(text) {
  const key = "Wc0gT/1xfFAjlRwip7l7MmEdjw7DzMXa";
  // console.log(text+ '//' + key);
  text = text == undefined || text == null ? "" : text;
  return Array.prototype.slice
    .call(text)
    .map(function (c, index) {
      return String.fromCharCode(
        c.charCodeAt(0) ^ key[index % key.length].charCodeAt(0)
      );
    })
    .join("");
}

export default class NakamaManager {
  static instance = null;

  static getInstance() {
    let myInstance = NakamaManager.instance;
    if (!myInstance) {
      myInstance = new NakamaManager();
      NakamaManager.instance = myInstance;
    }
    return myInstance;
  }

  // (1) base data
  client = client;
  session = null;

  // (2) game data
  gameId = "game_data";
  dataList = [
    "balance_data",
    "collection_data",
    "event_data",
    "map_data",
    "merge_data",
    "special_order",
    "store_data",
    "text_data",
    "unit_data",
  ];
  gameData = {};

  loadedNum = 0;
  loadCB = null;

  async getSession() {
    if (!this.session) {
      const session = await client.authenticateEmail(email, password);
      this.session = session;
      console.log("nakama connected", session);
    }
  }

  async initNakamaManager() {
    this.client.rpc = async (session, id, input) => {
      if (
        this.client.autoRefreshSession &&
        session.refresh_token &&
        session.isexpired((Date.now() + this.client.expiredTimespanMs) / 1000)
      ) {
        await this.client.sessionRefresh(session);
      }

      return this.client.apiClient
        .rpcFunc(session.token, id, xorConvert(JSON.stringify(input)))
        .then((response) => {
          return Promise.resolve({
            id: response.id,
            payload: !response.payload
              ? undefined
              : JSON.parse(xorConvert(response.payload)),
          });
        });
    };

    return new Promise(async (resolve) => {
      this.loadedNum++;
      if (!this.session) {
        await this.getSession();
        this.loadedNum++;
        if (this.loadCB) {
          this.loadCB(1);
        }
      }

      if (!this.gameData.baseData) {
        await this.loadBaseData();
        this.loadedNum++;
        if (this.loadCB) {
          this.loadCB(2);
        }
      }

      resolve(this);
    });
  }

  async loadBaseData(baseData) {
    const rpcid = "load_base_data";
    try {
      const data = await this.client.rpc(this.session, rpcid, {
        apiKey: "613d1bc0-68cd-4105-b491-e6140fdd663f",
        id: this.gameId,
        list: this.dataList,
      });
      console.log("check data", data);
      return data.payload.success;
    } catch (err) {
      console.log("check error", err);
      return "error";
    }
  }

  async setUnitAdmin(unitData) {
    const rpcid = "set_unit_admin";
    try {
      const data = await this.client.rpc(this.session, rpcid, {
        apiKey: "613d1bc0-68cd-4105-b491-e6140fdd663f",
        unitData: unitData,
      });
      return data.payload.success;
    } catch (err) {
      return "error";
    }
  }

  uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async sendImage(fileName, img) {
    const r = await fetch(
      "https://us-central1-alcatmist-2c78e.cloudfunctions.net/uploadImage",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          image: String(img),
          fileName: fileName,
        }),
      }
    );
    return JSON.parse(await r.text());
  }

  async sendData(collection, doc, data) {
    const r = await fetch(
      "https://us-central1-alcatmist-2c78e.cloudfunctions.net/uploadData",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          collection: String(collection),
          doc: String(doc),
          data: JSON.stringify(data),
        }),
      }
    ).catch(() => {});
    if (r) {
      return JSON.parse(await r.text());
    }
  }

  async readImgAsync(fileResult) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        resolve(img);
      };
      img.onerror = reject;
      img.src = fileResult;
    });
  }

  async downLoadImage(myUrl) {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.responseType = "blob";
      xhr.onload = async () => {
        const reader = new FileReader();
        reader.onloadend = async function () {
          resolve(reader.result);
        };
        reader.readAsDataURL(xhr.response);
      };
      xhr.open("GET", myUrl);
      xhr.send();
    });
  }
}
