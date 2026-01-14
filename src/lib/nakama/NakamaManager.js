import { Client } from "@heroiclabs/nakama-js";

////////////////////////////////////////////////////////////

const gameId = "blade_mater";
const dataList = [
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

//////////////////////////////////////////////////////////////

const useSSL = false;
const host = "www.chamelio.kr";
const client = new Client("defaultkey", host, "7650", useSSL);
const email = "jhyoo89591@gmail.com";
const password = "Vmflxkdla1!";

const xorKey = "Wc0gT/1xfFAjlRwip7l7MmEdjw7DzMXa";
const xorKeyLength = xorKey.length;
const xorKeyCodes = new Array(xorKeyLength);
for (let i = 0; i < xorKeyLength; i++) {
  xorKeyCodes[i] = xorKey.charCodeAt(i);
}

function xorConvert(text) {
  text = text == undefined || text == null ? "" : text;
  const len = text.length;
  const out = new Array(len);
  for (let i = 0; i < len; i++) {
    out[i] = String.fromCharCode(
      text.charCodeAt(i) ^ xorKeyCodes[i % xorKeyLength]
    );
  }
  return out.join("");
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
  gameData = {};

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
      if (!this.session) {
        await this.getSession();
      }

      if (!this.gameData.baseData) {
        await this.loadBaseData();

        const list = dataList;
        for (let i in list) {
          const id = list[i];
          await this.loadGameData(id);
        }
      }

      console.log("check data complete", this.gameData);
      resolve(this);
    });
  }

  async loadBaseData() {
    const rpcid = "load_base_data";
    try {
      const data = await this.client.rpc(this.session, rpcid, {
        apiKey: "613d1bc0-68cd-4105-b491-e6140fdd663f",
        id: gameId,
        list: dataList,
      });
      console.log("check base data", data);
      this.gameData = data.payload;

      return data.payload.success;
    } catch (err) {
      console.log("check error", err);
      return "error";
    }
  }

  async loadGameData(dataId) {
    const rpcid = "load_game_data";
    try {
      const data = await this.client.rpc(this.session, rpcid, {
        apiKey: "613d1bc0-68cd-4105-b491-e6140fdd663f",
        id: gameId,
        dataId,
      });

      let camalKey = dataId.replace(/_([a-z])/g, function (g) {
        return g[1].toUpperCase();
      });
      camalKey = camalKey + "s";

      this.gameData[camalKey] = data.payload;

      console.log("check game data", dataId, data);
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
