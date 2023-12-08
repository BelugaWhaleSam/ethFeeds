import React, { useState, useEffect, FormEvent } from "react";
import { BiconomySmartAccount } from "@biconomy/account";
import {
  IHybridPaymaster,
  SponsorUserOperationDto,
  PaymasterMode,
} from "@biconomy/paymaster";
import abi from "../utils/counterAbi.json";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Feedback.css";

interface Props {
  smartAccount: BiconomySmartAccount;
  provider: any;
}

const Counter: React.FC<Props> = ({ smartAccount, provider }) => {
  const [counterContract, setCounterContract] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [role, setRole] = useState<any>("");
  const [name, setName] = useState<any>("");
  const [email, setEmail] = useState<any>("");
  const [feedback, setFeedback] = useState<any>("");

  const counterAddress = "0x549feA300cA1C29306806e5CbC96fe00727d740d";

  useEffect(() => {
    setIsLoading(true);
  }, []);

  const addDetails = async () => {
    const contract = new ethers.Contract(counterAddress, abi, provider);

    setCounterContract(contract);

    const detail: {
      roleDetail: string;
      nameDetail: string;
      emailDetail: string;
      feedbackDetail: string;
    } = {
      roleDetail: role,
      nameDetail: name,
      emailDetail: email,
      feedbackDetail: feedback,
    };
    try {
      toast.info("Processing student details on the blockchain!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      const incrementTx = await contract.populateTransaction.addFeedback(
        detail.roleDetail,
        detail.nameDetail,
        detail.emailDetail,
        detail.feedbackDetail
      );
      const tx1 = {
        to: counterAddress,
        data: incrementTx.data,
      };
      console.log("HERE",smartAccount);
      
      let partialUserOp = await smartAccount.buildUserOp([tx1]);

      const biconomyPaymaster =
        smartAccount.paymaster as IHybridPaymaster<SponsorUserOperationDto>;

      let paymasterServiceData: SponsorUserOperationDto = {
        mode: PaymasterMode.SPONSORED,
      };
      console.log("end");

      try {
        const paymasterAndDataResponse =
          await biconomyPaymaster.getPaymasterAndData(
            partialUserOp,
            paymasterServiceData
          );
        partialUserOp.paymasterAndData =
          paymasterAndDataResponse.paymasterAndData;

        const userOpResponse = await smartAccount.sendUserOp(partialUserOp);
        const transactionDetails = await userOpResponse.wait();

        console.log("Transaction Details:", transactionDetails);
        console.log("Transaction Hash:", userOpResponse.userOpHash);

        toast.success(`Transaction Hash: ${userOpResponse.userOpHash}`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      } catch (e) {
        console.error("Error executing transaction:", e);
        // ... handle the error if needed ...
      }
    } catch (error) {
      console.error("Error executing transaction:", error);
      toast.error("Error occurred, check the console", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Your logic for adding a student here
    addFeedback();

    setRole("");
    setName("");
    setEmail("");
    setFeedback("");
  };

  const addFeedback = () => {
    addDetails();
  };

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <br></br>
      <h2>Your Feedback</h2>
      <form onSubmit={(e) => handleSubmit(e)}>
        <select
          className="select"
          onChange={(e) => setRole(e.target.value)}
          value={role}
          required
        >
          <option value="" disabled>
            Select Role
          </option>
          <option value="Builder">Builder</option>
          <option value="Marketer">Marketer</option>
          <option value="Community Manager">Community Manager</option>
          <option value="Investor/VC">Investor/VC</option>
        </select>
        <input
          className="input"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          value={name}
          type="text"
          required
        />
        <input
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
          type="text"
          required
        />
        <input
          className="input"
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Feedback"
          value={feedback}
          type="text"
          required
        />
        <br />
        <button type="submit">Go Vroom!</button>
      </form>
    </>
  );
};

export default Counter;
