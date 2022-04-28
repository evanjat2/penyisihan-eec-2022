import Head from "next/head";
import Image from "next/image";
import { db } from "../firebase/clientApp";
import {
  collection,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  query,
  onSnapshot,
  where,
  deleteField,
  deleteDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { dataQuestion } from "../data/questionnumber";
import { spawn } from "child_process";
export default function Home() {
  const [images, setImage] = useState(dataQuestion);
  const [questionState, setQuestionState] = useState(1);
  const [categoryState, setCategoryState] = useState("matematika");
  const [filteredNumber, setFilteredNumber] = useState([]);
  const filteredImages = images.filter(
    (image) => image.number == questionState
  );

  //Fetching jawaban
  const [answer, setAnswer] = useState([]);
  const fetchAnswer = async () => {
    const q = query(
      collection(db, "acara", "eec", "tim", "abcde", "jawabanpenyisihan")
    );
    const ans = [];
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        ans.push(doc.data());
      });
      setAnswer(ans);
    });
  };
  const curentAnswer = answer.filter((ans) => ans.number == questionState);

  const toggleQuestion = (index: any) => {
    fetchAnswer();
    setQuestionState(index);
    fetchQuestion(categoryState);
  };
  const toggleCategory = (category: any) => {
    setCategoryState(category);
    fetchAnswer();
    fetchQuestion(category);
  };

  //Fetch Question
  const [number, setNumber] = useState(dataQuestion);
  const fetchQuestion = (categoryState) => {
    setNumber(dataQuestion);
    setFilteredNumber(number.filter((num) => num.category == categoryState));
  };
  const curentChoice = filteredNumber.filter(
    (quest) => quest.number == questionState
  );
  useEffect(() => {
    fetchAnswer();
    setCategoryState("matematika");
    fetchQuestion(categoryState);
  }, []);
  const tandaiSoal = async (soal: any) => {
    const docRef = doc(
      db,
      "acara",
      "eec",
      "tim",
      "abcde",
      "jawabanpenyisihan",
      `${soal}`
    );
    const docSnap = await getDoc(docRef);
    {
      docSnap.exists()
        ? docSnap.data().ragu == "yes"
          ? docSnap.data().answer != null
            ? await updateDoc(docRef, {
                ragu: deleteField(),
              })
            : await deleteDoc(docRef)
          : await updateDoc(docRef, {
              ragu: "yes",
            })
        : await setDoc(docRef, {
            ragu: "yes",
            number: soal,
          });
    }
    fetchAnswer();
  };
  const prevAnswer = () => {
    number.filter((list) => list.number == questionState - 1) != 0
      ? setQuestionState(questionState - 1)
      : console.log("not exist");
  };
  const nextAnswer = () => {
    number.filter((list) => list.number == questionState + 1) != 0
      ? setQuestionState(questionState + 1)
      : console.log("not exist");
  };
  const deleteAnswer = async (soal: any) => {
    const docRef = doc(
      db,
      "acara",
      "eec",
      "tim",
      "abcde",
      "jawabanpenyisihan",
      `${soal}`
    );
    const docSnap = await getDoc(docRef);
    {
      docSnap.exists()
        ? docSnap.data().ragu != null
          ? await updateDoc(docRef, {
              answer: deleteField(),
            })
          : await deleteDoc(docRef)
        : {};
    }
    fetchAnswer();
    fetchQuestion(categoryState);
  };
  const fillAnswer = async (answer: string, soal: any) => {
    const docRef = doc(
      db,
      "acara",
      "eec",
      "tim",
      "abcde",
      "jawabanpenyisihan",
      `${soal}`
    );
    const docSnap = await getDoc(docRef);
    {
      docSnap.exists()
        ? await updateDoc(docRef, {
            number: soal,
            answer: answer,
          })
        : await setDoc(docRef, {
            number: soal,
            answer: answer,
          });
    }
    fetchAnswer();
    fetchQuestion(categoryState);
  };
  const currentAnswerCSS = "font-bold border cursor-pointer";
  const activeCategoryCSS =
    "rounded-t-lg bg-white-default text-black-default cursor-pointer";
  const unactiveCategoryCSS = "bg-green-dark text-white-default cursor-pointer";
  return (
    <>
      <div className="m-4">
        EEC
        <div className=" grid grid-cols-2 gap-8 ">
          <div>
            <div className="min-h-[80vh]">
              <div className="px-2 mb-3 flex justify-between bg-green-dark text-white-default rounded-md gap-4 ">
                <div className="">Soal {questionState}</div>
                <div
                  className="cursor-pointer text-yellow-500"
                  onClick={() => tandaiSoal(questionState)}
                >
                  Tandai Soal
                </div>
              </div>

              {filteredImages.map((soal) => (
                <>
                  <div className="block text-left" key={soal.number}>
                    <Image src={soal.soal} width={1000}></Image>
                  </div>
                  <div
                    onClick={() => fillAnswer("a", soal.number)}
                    className={
                      curentAnswer.length != 0
                        ? curentAnswer[0].answer == "a"
                          ? currentAnswerCSS
                          : "border cursor-pointer"
                        : "border cursor-pointer"
                    }
                  >
                    a
                  </div>
                  <div
                    onClick={() => fillAnswer("b", soal.number)}
                    className={
                      curentAnswer.length != 0
                        ? curentAnswer[0].answer == "b"
                          ? currentAnswerCSS
                          : "border cursor-pointer"
                        : "border cursor-pointer"
                    }
                  >
                    b
                  </div>
                  <div
                    onClick={() => fillAnswer("c", soal.number)}
                    className={
                      curentAnswer.length != 0
                        ? curentAnswer[0].answer == "c"
                          ? currentAnswerCSS
                          : "border cursor-pointer"
                        : "border cursor-pointer"
                    }
                  >
                    c
                  </div>
                  <div
                    onClick={() => fillAnswer("d", soal.number)}
                    className={
                      curentAnswer.length != 0
                        ? curentAnswer[0].answer == "d"
                          ? currentAnswerCSS
                          : "border cursor-pointer"
                        : "border cursor-pointer"
                    }
                  >
                    d
                  </div>
                  <div
                    onClick={() => fillAnswer("e", soal.number)}
                    className={
                      curentAnswer.length != 0
                        ? curentAnswer[0].answer == "e"
                          ? currentAnswerCSS
                          : "border cursor-pointer"
                        : "border cursor-pointer"
                    }
                  >
                    e
                  </div>
                </>
              ))}
            </div>
            <div className="flex justify-between">
              <div
                className="bg-yellow-light rounded-md px-2 cursor-pointer"
                onClick={() => prevAnswer()}
              >
                Soal Sebelumnya
              </div>
              <div
                className="bg-red-light rounded-md px-2 cursor-pointer"
                onClick={() => deleteAnswer(questionState)}
              >
                Hapus Jawaban
              </div>
              <div
                className="bg-yellow-light rounded-md px-2 cursor-pointer"
                onClick={() => nextAnswer()}
              >
                Soal Selanjutnya
              </div>
            </div>
          </div>
          <div className="h-min bg-green-dark p-4 rounded-lg">
            <div className="text-white-default"> Soal </div>
            <div className="grid grid-cols-3 text-white-default text-center">
              <div
                className={
                  categoryState == "matematika"
                    ? activeCategoryCSS
                    : unactiveCategoryCSS
                }
                onClick={() => toggleCategory("matematika")}
              >
                {" "}
                Matematika{" "}
              </div>
              <div
                className={
                  categoryState == "fisika"
                    ? activeCategoryCSS
                    : unactiveCategoryCSS
                }
                onClick={() => toggleCategory("fisika")}
              >
                {" "}
                Fisika{" "}
              </div>
              <div
                className={
                  categoryState == "komputer"
                    ? activeCategoryCSS
                    : unactiveCategoryCSS
                }
                onClick={() => toggleCategory("komputer")}
              >
                Komputer
              </div>
            </div>
            <div className="grid grid-cols-8 gap-y-2 bg-white-default rounded-b-lg">
              {filteredNumber.map((soal) => (
                <>
                  <div
                    className={
                      answer.filter((ans) => ans.number == soal.number)
                        .length != 0
                        ? answer.filter((ans) => ans.number == soal.number)[0]
                            .ragu == "yes"
                          ? "bg-yellow-default w-12 grid content-center text-center rounded-b-lg cursor-pointer"
                          : "bg-green-default w-12 grid content-center text-center rounded-b-lg cursor-pointer"
                        : "bg-black-default w-12 grid content-center text-center text-white-default rounded-b-lg cursor-pointer"
                    }
                    key={soal.number}
                    style={{ aspectRatio: "1/1" }}
                    onClick={() => toggleQuestion(soal.number)}
                  >
                    {soal.number}
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
