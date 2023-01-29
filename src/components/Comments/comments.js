import { useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  ViewComment,
  InputComment,
  ImageUser,
  Icon,
  ContainerRated,
  Star,
  StarFilled,
  CommentContainer,
} from "./styles";

import { IoMdSend, IoIosStarOutline, IoIosStar } from "react-icons/io";
import CommentStyle from "../Comment/comment";
import { ThreeDots } from "react-loader-spinner";
import Swal from "sweetalert2";
import { postCommentsMovie } from "../../services/apiService";

export default function Comments({
  inputRef,
  data,
  loading,
  getComment,
  movieid,
}) {
  const [rated, setRated] = useState(0);
  const [text, setText] = useState("");

  const navigate = useNavigate();

  const urlProfile = JSON.parse(localStorage.getItem("bucketflix"));

  async function postComment() {
    if (rated === 0) {
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Escolha a sua nota clicando nas estrelas",
        showConfirmButton: false,
        timer: 1500,
      });
      return;
    }
    try {
      await postCommentsMovie(urlProfile.token, movieid, rated, text);
      getComment();
    } catch (error) {
      console.log(error);
      if (error.response.data.msg) {
        Swal.fire({
          position: "top-end",
          icon: "error",
          title: `${error.response.data.msg}`,
          showConfirmButton: false,
          timer: 1500,
        });

        return;
      }
      Swal.fire({
        position: "top-end",
        icon: "error",
        title: "Algo de errado aconteceu, tente novamente mais tarde",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }

  return (
    <>
      <ContainerRated>
        {rated === 0 && (
          <>
            <Star>
              <IoIosStarOutline onClick={() => setRated(1)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(2)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(3)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(4)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(5)} />
            </Star>
          </>
        )}
        {rated === 1 && (
          <>
            <StarFilled>
              <IoIosStar onClick={() => setRated(1)} />
            </StarFilled>
            <Star>
              <IoIosStarOutline onClick={() => setRated(2)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(3)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(4)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(5)} />
            </Star>
          </>
        )}
        {rated === 2 && (
          <>
            <StarFilled>
              <IoIosStar onClick={() => setRated(1)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(2)} />
            </StarFilled>
            <Star>
              <IoIosStarOutline onClick={() => setRated(3)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(4)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(5)} />
            </Star>
          </>
        )}
        {rated === 3 && (
          <>
            <StarFilled>
              <IoIosStar onClick={() => setRated(1)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(2)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(3)} />
            </StarFilled>
            <Star>
              <IoIosStarOutline onClick={() => setRated(4)} />
            </Star>
            <Star>
              <IoIosStarOutline onClick={() => setRated(5)} />
            </Star>
          </>
        )}
        {rated === 4 && (
          <>
            <StarFilled>
              <IoIosStar onClick={() => setRated(1)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(2)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(3)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(4)} />
            </StarFilled>
            <Star>
              <IoIosStarOutline onClick={() => setRated(5)} />
            </Star>
          </>
        )}
        {rated === 5 && (
          <>
            <StarFilled>
              <IoIosStar onClick={() => setRated(1)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(2)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(3)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(4)} />
            </StarFilled>
            <StarFilled>
              <IoIosStar onClick={() => setRated(5)} />
            </StarFilled>
          </>
        )}
      </ContainerRated>
      <ViewComment>
        <ImageUser
          src={urlProfile.img}
          onClick={() => navigate(`/user/${urlProfile.userid}`)}
        />
        <InputComment
          placeholder="Escreva sua opinião do filme"
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Icon onClick={postComment}>
          <IoMdSend />
        </Icon>
      </ViewComment>
      <CommentContainer>
        {loading ? (
          <ThreeDots color="white" height={40} width={40} />
        ) : data.length > 0 ? (
          data.map((item, index) => (
            <CommentStyle
              key={index}
              name={item.users.username}
              img={item.users.pictureUrl}
              comment={item.comment}
              date={item.createdat}
              userid={item.users.id}
              rate={item.rating}
            />
          ))
        ) : (
          <p>Ninguém comentou nesse filme</p>
        )}
      </CommentContainer>
    </>
  );
}
