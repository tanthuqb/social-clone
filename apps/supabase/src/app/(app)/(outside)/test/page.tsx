"use client";
import React from "react";

export default function TestPage() {
  const Test = async () => {
    const { result } = await fetch("http://localhost:3000/api/test", {
      method: "POST",
      body: JSON.stringify({
        email: "ghinlop.5@gmail.com",
        password: "Long@123",
      }),
    })
      .then((v) => v.json())
      .catch((e) => console.log(e));
    if (result) {
      // window.location.assign(result.url);
    }
  };

  return (
    <div>
      <button className="bg-black p-3 text-white" onClick={() => Test()}>
        Test API
      </button>
    </div>
  );
}
