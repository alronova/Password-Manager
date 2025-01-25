const SECRET_KEY = import.meta.env.VITE_SECRET_KEY;
import React from "react";
import { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";

import "react-toastify/dist/ReactToastify.css";

const Manager = () => {
  const passwordRef = useRef();
  const [form, setform] = useState({ website: "", mail: "", password: "" });
  const [passwordArray, setPasswordArray] = useState([]);
  const UserName = localStorage.getItem("UserName");
  const UserId = localStorage.getItem("UserId");

  const getPasswords = async () => {
    let req = await fetch("https://password-manager-i5cj.onrender.com/pass/getCredential", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: UserId }),
    });
    let passwords = await req.json();
    setPasswordArray(passwords.creds || []);
    setform({ website: "", mail: "", password: "", id: "" });
    // console.log("Passwords:", passwords.creds);
  };

  useEffect(() => {
    getPasswords();
  }, []);

  const copyText = (text) => {
    toast("Copied to clipboard!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
    navigator.clipboard.writeText(text);
  };

  const savePassword = async () => {
    if (
      form.website.length > 3 &&
      form.mail.length > 3 &&
      form.password.length > 3
    ) {
      try {
        const encryptedPassword = CryptoJS.AES.encrypt(
          form.password,
          SECRET_KEY
        ).toString();
        // console.log(encryptedPassword);
        const passwordData = {
          website: form.website,
          mail: form.mail,
          encKey: encryptedPassword,
          password: encryptedPassword,
          id: uuidv4(),
        };
        // console.log(passwordData);
        setPasswordArray([...passwordArray, passwordData]);
        setform({ website: "", mail: "", password: "", id: "" });
        await fetch("https://password-manager-i5cj.onrender.com/pass/saveCredential", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...passwordData, userId: UserId }),
        });
        
        toast("Password saved!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        toast.error("Error saving password!\n", error);
      }
    } else {
      toast.error("Please fill all fields correctly!");
    }
  };

  

  const deletePassword = async (id) => {
    try {
      const confirmed = confirm("Do you really want to delete this password?");
      if (!confirmed) return;
      // console.log(id);

      const response = await fetch(
        "https://password-manager-i5cj.onrender.com/pass/deleteCredential",
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: UserId,
            credId: id,
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Password deleted successfully!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        throw new Error(data.message || "Failed to delete password");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete password. Please try again.");
    }
  };

  const editPassword = async (id) => {
    let sure = confirm(
      "If you edit the password, and do not save it then the older saved credentials will also be deleted."
    );
    if (sure) {
      const res = await fetch("https://password-manager-i5cj.onrender.com/pass/findCredential", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: UserId, credId: id }),
      });
      const msg = await res.json();
      const data = msg.updatedUser;
      // console.log(data);

      setform({ website: data.website, mail: data.mail, password: "" });
      // console.log(form);
      toast.success("Edit your Credentials and save it!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  const decryptPassword = async (id) => {
    let pass = prompt("Enter the Password of your Password Manager Account:");
    let req = await fetch("https://password-manager-i5cj.onrender.com/pass/decryptCredential", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: UserId, pass, credId: id }),
    });
    let res = await req.json();
    // console.log(res.success);
    if (res.success) {
      alert(`the required password for '${res.website}' is: "${res.decKey}"`);
    } else {
      alert("You are not authorized to view this password");
    }
  };

  const handleChange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <>
      <ToastContainer />

      <div className=" p-3 md:mycontainer min-h-[88.2vh] ">
        <h1 className="text-4xl text font-bold text-center font-mono">
          Welcome {UserName}!!
        </h1>
        <p className="text-blue-900 text-lg text-center">
          Your own Password Manager
        </p>

        <div className="flex flex-col p-4 text-black gap-6 items-center">
          <input
            value={form.website}
            onChange={handleChange}
            placeholder="Website URL"
            className="rounded-lg border border-violet-500 focus:ring-2 focus:ring-violet-400 shadow-sm w-full p-4 text-sm placeholder-gray-500"
            type="text"
            name="website"
            id="website"
          />

          <div className="flex flex-col md:flex-row w-full justify-between gap-6">
            <input
              value={form.mail}
              onChange={handleChange}
              placeholder="Email Id"
              className="rounded-lg border border-violet-500 focus:ring-2 focus:ring-violet-400 shadow-sm w-full p-4 text-sm placeholder-gray-500"
              type="text"
              name="mail"
              id="mail"
            />

            <div className="relative w-full">
              <input
                ref={passwordRef}
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="rounded-lg border border-violet-500 focus:ring-2 focus:ring-violet-400 shadow-sm w-full p-5 text-sm placeholder-gray-500"
                type="password"
                name="password"
                id="password"
              />
            </div>
          </div>

          <button
            onClick={savePassword}
            className="flex justify-center items-center gap-2 bg-purple-700 hover:bg-violet-500 text-white rounded-lg font-mono px-8 py-2 w-fit shadow-md transition-transform transform hover:scale-105 border border-green-900"
          >
            Save
          </button>
        </div>

        <div className="passwords bg-white/70 bg-transparent backdrop-blur-md shadow-lg rounded-lg p-6 w-full">
          <h2 className="font-extrabold text-2xl py-4 font-mono">
            Your Credentials
          </h2>
          {passwordArray.length === 0 && <div> No passwords to show</div>}
          {passwordArray.length != 0 && (
            <table className="table-auto w-full rounded-md overflow-hidden mb-10 font-mono">
              <thead className="bg-purple-500 backdrop-blur-md text-white">
                <tr>
                  <th className="py-2">Site</th>
                  <th className="py-2">Username</th>
                  <th className="py-2">Encrypted Password</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-violet-100">
                {passwordArray.map((item, index) => {
                  return (
                    <tr key={index}>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <a
                            href={
                              item.website.startsWith("http" || "https")
                                ? item.website
                                : `http://${item.website}`
                            }
                            target="_blank"
                          >
                            {item.website}
                          </a>
                          <div
                            className="size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.website);
                            }}
                          >
                            <img
                              style={{
                                width: "20px",
                                height: "20px",
                                paddingTop: "6px",
                                paddingLeft: "5px",
                              }}
                              src="/images/copy.png"
                              alt="copy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <span>{item.mail}</span>
                          <div
                            className="size-7 cursor-pointer"
                            onClick={() => {
                              copyText(item.mail);
                            }}
                          >
                            <img
                              style={{
                                width: "20px",
                                height: "20px",
                                paddingTop: "6px",
                                paddingLeft: "5px",
                              }}
                              src="/images/copy.png"
                              alt="copy"
                            />
                          </div>
                        </div>
                      </td>
                      <td className="py-2 border border-white text-center">
                        <div className="flex items-center justify-center ">
                          <span>{item.encKey}</span>
                          {/* <div className='size-7 cursor-pointer' onClick={() => { copyText(item.encKey) }}>
                                            <img style={{ "width": "20px", "height": "20px", "paddingTop": "6px", "marginLeft":"10px"}} src="/images/copy.png" alt="copy" />
                                            </div> */}
                        </div>
                      </td>
                      <td className="justify-center py-2 border border-white text-center flex flex-items-center justify-around">
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            editPassword(item._id);
                          }}
                        >
                          <img
                            src="/images/edit.png"
                            style={{ width: "25px", height: "25px" }}
                            alt="edit"
                          />
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            decryptPassword(item._id);
                          }}
                        >
                          <img
                            src="/images/decrypt.png"
                            style={{ width: "25px", height: "25px" }}
                            alt="decrypt"
                          />
                        </span>
                        <span
                          className="cursor-pointer mx-1"
                          onClick={() => {
                            deletePassword(item._id);
                          }}
                        >
                          <img
                            src="/images/delete.png"
                            style={{ width: "25px", height: "25px" }}
                            alt="delete"
                          />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
};

export default Manager;
