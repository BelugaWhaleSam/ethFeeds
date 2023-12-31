import "./App.css";
import "@biconomy/web3-auth/dist/src/style.css";
import { useState, useEffect, useRef } from "react";
import SocialLogin from "@biconomy/web3-auth";
import { ChainId } from "@biconomy/core-types";
import { ethers } from "ethers";
import { IBundler, Bundler } from "@biconomy/bundler";
import {
  BiconomySmartAccount,
  BiconomySmartAccountConfig,
  DEFAULT_ENTRYPOINT_ADDRESS,
} from "@biconomy/account";
import { IPaymaster, BiconomyPaymaster } from "@biconomy/paymaster";
import Counter from "./Components/Feedback";
import Feed from "./Components/Feed";

const bundler: IBundler = new Bundler({
  bundlerUrl:
    "https://bundler.biconomy.io/api/v2/80001/nJPK7B3ru.dd7f7861-190d-41bd-af80-6877f74b8f44", // you can get this value from biconomy dashboard.
  chainId: ChainId.POLYGON_MUMBAI,
  entryPointAddress: DEFAULT_ENTRYPOINT_ADDRESS,
});

const paymaster: IPaymaster = new BiconomyPaymaster({
  paymasterUrl:
    "https://paymaster.biconomy.io/api/v1/80001/1DodlslJm.7bba05f7-26b6-48b9-9043-d1405b53b35f",
});

export default function Home() {
  const [smartAccount, setSmartAccount] = useState<any>(null);
  const [interval, enableInterval] = useState(false);
  const sdkRef = useRef<SocialLogin | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<any>(null);

  useEffect(() => {
    let configureLogin: any;
    if (interval) {
      configureLogin = setInterval(() => {
        if (!!sdkRef.current?.provider) {
          setupSmartAccount();
          clearInterval(configureLogin);
        }
      }, 1000);
    }
  }, [interval]);

  async function login() {
    if (!sdkRef.current) {
      const socialLoginSDK = new SocialLogin();
      const signature1 = await socialLoginSDK.whitelistUrl(
        "https://aanft.vercel.app"
      );
      await socialLoginSDK.init({
        chainId: ethers.utils.hexValue(ChainId.POLYGON_MUMBAI).toString(),
        network: "testnet",
        whitelistUrls: {
          "https://aanft.vercel.app": signature1,
        },
      });
      sdkRef.current = socialLoginSDK;
    }
    if (!sdkRef.current.provider) {
      sdkRef.current.showWallet();
      enableInterval(true);
    } else {
      setupSmartAccount();
    }
  }

  async function setupSmartAccount() {
    if (!sdkRef?.current?.provider) return;
    sdkRef.current.hideWallet();
    setLoading(true);
    const web3Provider = new ethers.providers.Web3Provider(
      sdkRef.current.provider
    );
    setProvider(web3Provider);

    try {
      const biconomySmartAccountConfig: BiconomySmartAccountConfig = {
        signer: web3Provider.getSigner(),
        chainId: ChainId.POLYGON_MUMBAI,
        bundler: bundler,
        paymaster: paymaster,
      };
      let biconomySmartAccount = new BiconomySmartAccount(
        biconomySmartAccountConfig
      );
      biconomySmartAccount = await biconomySmartAccount.init();
      console.log("owner: ", biconomySmartAccount.owner);
      console.log(
        "address: ",
        await biconomySmartAccount.getSmartAccountAddress()
      );
      console.log(
        "deployed: ",
        await biconomySmartAccount.isAccountDeployed(
          await biconomySmartAccount.getSmartAccountAddress()
        )
      );

      setSmartAccount(biconomySmartAccount);
      console.log("smart account: ", smartAccount);
      
      setLoading(false);
    } catch (err) {
      console.log("error setting up smart account... ", err);
    }
  }

  const logout = async () => {
    if (!sdkRef.current) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await sdkRef.current.logout();
    sdkRef.current.hideWallet();
    
    setSmartAccount(null);
    enableInterval(false);
  };

  return (
    <div>
      <h1>ethFeeds</h1>
      <p>
        feedbacks stored on Polygon Chain, made using social
        login for account abstraction and allows gasless+sponsored transactions for ease.
      </p>
      <p>
        <a href="https://mumbai.polygonscan.com/address/0x02e53fe36999fe03e218354ea03cb934cef6a740">
          Take me there
        </a>
        {" "}
        visit here to view the blocks for feedbacks published on Polygon
        Blockchain{" "}
      </p>

      {!smartAccount && !loading && <button onClick={login}>Login</button>}
      {loading && <p>Loading account details...</p>}
      {!!smartAccount && (
        <div className="buttonWrapper">
          <h3>Smart account address:</h3>
          <p>{smartAccount.address}</p>
          <button onClick={logout}>Logout</button>
          <Counter smartAccount={smartAccount} provider={provider} />
          <Feed provider={provider} />
        </div>
      )}
    </div>
  );
}
