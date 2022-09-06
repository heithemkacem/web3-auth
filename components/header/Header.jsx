import React from "react";
import styles from "./header.module.css";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { signIn, useSession } from "next-auth/react";
import { useAccount, useSignMessage, useNetwork } from "wagmi";
import { useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import ModelViewer from "./../home/ModelViewer";
const Header = () => {
  const { isConnected, address } = useAccount();
  const { chain } = useNetwork();
  const { status } = useSession();
  const { signMessageAsync } = useSignMessage();
  const { push } = useRouter();
  {
    /* added ConnectButton from metamask */
  }

  useEffect(() => {
    const handleAuth = async () => {
      const userData = { address, chain: chain.id, network: "evm" };

      const { data } = await axios.post("/api/auth/request-message", userData, {
        headers: {
          "content-type": "application/json",
        },
      });

      const message = data.message;

      const signature = await signMessageAsync({ message });

      // redirect user after success authentication to '/user' page
      const { url } = await signIn("credentials", {
        message,
        signature,
        redirect: true,
        callbackUrl: "/user",
      });

      push(url);
    };
    // if is not authnenticated, but wallet is connected we request a signing message and sign it
    if (status === "unauthenticated" && isConnected) {
      handleAuth();
    }
  }, [status, isConnected]);
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Link href="/">
          <div className={styles.etherum3D}>
            <ModelViewer scale="0.0043" modelPath={"/ethereum_3d_logo.glb"} />
          </div>
        </Link>
      </div>
      <div className={styles.connectionButton}>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Header;
