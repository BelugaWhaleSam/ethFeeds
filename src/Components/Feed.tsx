import React, { useState, useEffect } from "react";
import { ethers } from 'ethers';
import abi from "../utils/counterAbi.json";
import './Feed.css'
import { typeFeeback } from "./type";

interface Feedback {
  id: number;
  role: string;
  Name: string;
  email: string;
  feedback: string;
  username: string;
}
interface Props {
  provider: any
}

const Feed: React.FC<Props> = ({ provider }) => {
  const [posts, setPosts] = useState<Feedback[]>([]);
  const [item, setItem] = useState({ name: "all" });
  const [active, setActive] = useState(0);

  const getUpdatedFeedbacks = (allFeedbacks: Feedback[], address: string) => {
    let updatedFeedback: Feedback[] = [];
    for (let i = 0; i < allFeedbacks.length; i++) {
    {
        let feedback: Feedback = {
          id: allFeedbacks[i].id,
          role: allFeedbacks[i].role,
          Name: allFeedbacks[i].Name,
          email: allFeedbacks[i].email,
          feedback: allFeedbacks[i].feedback,
          username: allFeedbacks[i].username,
        };
        updatedFeedback.push(feedback);
      } 
    }
    return updatedFeedback;
  }

  const getAllFeedback = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const accountAddress = "0x549feA300cA1C29306806e5CbC96fe00727d740d"
        const FeedbackContract = new ethers.Contract(
          accountAddress,
          abi,
          provider
        )

        let allFeedbacks: Feedback[] = await FeedbackContract.getAllFeedback();
        setPosts(getUpdatedFeedbacks(allFeedbacks, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getCustomFeedback = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const accountAddress = "0x549feA300cA1C29306806e5CbC96fe00727d740d"
        const FeedbackContract = new ethers.Contract(
          accountAddress,
          abi,
          provider
        )

        let allFeedbacks: Feedback[] = await FeedbackContract.getAllFeedback();
        const newFeedbacks: Feedback[] = allFeedbacks.filter((post) => {
          return item.name === post.role;
        });
        setPosts(getUpdatedFeedbacks(newFeedbacks, ethereum.selectedAddress));
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (item.name === "all") {
      getAllFeedback();
    } else {
      getCustomFeedback();
    }
    
    // When the item changes, the useEffect is triggered
  }, [item]);

  const handleClick = (e: React.MouseEvent<HTMLSpanElement, globalThis.MouseEvent>, index: number) => {
    setItem({ name: e.currentTarget.textContent || '' });
    setActive(index);
  };

  return (
    <div>
      <div>
        <h3>Select your role</h3>
      </div>

      <div >
        {typeFeeback.map((item, index) => {
          return (
                  <span
                    onClick={(e) => {
                      handleClick(e, index);
                    }}
                    className={`${active === index ? 'active-work':''} work__item`}
                    key={index}
                  >
                    {item.name}
                  </span>
                );
              })}
            </div>

            <ul className="cards">
              {posts
            .sort((a, b) => parseInt(String(b.id)) - parseInt(String(a.id))) // Sort in descending order based on id
            .map((post) => (
        <li className="cards_item">
          <div className="card">
            <div className="card_content" key={post.id}>
              <p className="card_title">{parseInt(String(post.id))}</p>
              <p className="card_title">{post.role}</p>
              <p className="card_text"><b>Name:<br/> </b>{post.Name}</p>
              <p className="card_text"><b>Email:<br/> </b>{post.email}</p>
              <p className="card_text"><b>Feedback:<br/> </b>{post.feedback}</p>
            </div>
          </div>
        </li>
      ))}
      </ul>

      
    </div>
  );
}

export default Feed;
