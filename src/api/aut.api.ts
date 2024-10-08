import axios from "axios";
import { environment } from "./environment";
import { NetworkConfig } from "./models/network.config";
import { extractDomain } from "@utils/helpers";
import { useAutConnector, useWalletConnector } from "@aut-labs/connector";
import { useEffect, useState } from "react";

export const getAppConfig = (): Promise<NetworkConfig[]> => {
  return axios
    .get(`${environment.apiUrl}/aut/config/network/${environment.networkEnv}`)
    .then((r) => r.data);
};

export const useAuthenticatedApi = () => {
  const {
    state: { multiSigner, address }
  } = useWalletConnector();
  const [jwt, setjwt] = useState<string | null>(
    localStorage.getItem("interactions-api-jwt")
  );

  useEffect(() => {
    const handleStorageChange = () => {
      const jwt = localStorage.getItem("interactions-api-jwt");
      setjwt(jwt);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const authenticatedAction = async (action) => {
    if (jwt) {
      return action(jwt);
    }

    const { signer } = multiSigner;
    const message = {
      timestamp: Math.floor(Date.now() / 1000), // Subtract one hour (3600 seconds)
      signer: address,
      domain: extractDomain(environment.interactionsApiUrl)
    };
    const signature = await signer.signMessage(JSON.stringify(message));

    const response = await axios.post(
      `${environment.interactionsApiUrl}/auth/token`,
      { message, signature }
    );
    const data = await response.data;
    localStorage.setItem("interactions-api-jwt", data.token);
    setjwt(data.token);
    return action(data.token);
  };

  return { jwt, authenticatedAction };
};
