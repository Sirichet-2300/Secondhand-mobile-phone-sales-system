'use client';

import { useState, useEffect } from "react";
import { config } from "@/app/config";
import axios from "axios";
import Swal from "sweetalert2";
import Modal from "@/app/backoffice/modal";

export default function Page() {
    return (
        <div>
            <div className="content-header">ขายสินค้า</div>
                <div className="flex gap-2">
                    <input className="form-control" type="text"
                    placeholder="serial"></input>
                    <button className="btn flex item-center">
                        <i className="fa-solid fa-save mr-2">บันทึก</i>
                    </button>
                </div>
            </div>
    )}