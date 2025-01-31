"use client";
import React, { useEffect, useState } from "react";
import Header from "../header";

const StickyHeader = ({ profileInfo, user }) => {
  return (
    <header>
      <Header profileInfo={profileInfo} user={user} />
    </header>
  );
};

export default StickyHeader;
