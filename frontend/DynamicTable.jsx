import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

// Sample data for the table
const data = [
  {
    competencia: "123dfgfdgdf",
    kata: "Nage-no-kata(Forms of Throwing)",
    categoria: "NNK-MALE",
    orden: 123,
    club: "123sdgsdgsdgsg",
    total: 147,
  },
  {
    competencia: "aaaaaaaaaa",
    kata: "Nage-no-kata(Forms of Throwing)",
    categoria: "NNK-MALE",
    orden: 12323,
    club: "asaff",
    total: 145,
  },
  {
    competencia: "asg",
    kata: "Nage-no-kata(Forms of Throwing)",
    categoria: "NNK-FEMALE",
    orden: "sad",
    club: "9",
    total: 165,
  },
];

const Table = () => {
  return (
    <div className="p-4">
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2">Competencia</th>
            <th className="border border-gray-300 p-2">KaTa</th>
            <th className="border border-gray-300 p-2">Categoria</th>
            <th className="border border-gray-300 p-2">Orden</th>
            <th className="border border-gray-300 p-2">Club/Dpto/Pais</th>
            <th className="border border-gray-300 p-2">Total</th>
            <th className="border border-gray-300 p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              <td className="border border-gray-300 p-2">{row.competencia}</td>
              <td className="border border-gray-300 p-2">{row.kata}</td>
              <td className="border border-gray-300 p-2">{row.categoria}</td>
              <td className="border border-gray-300 p-2">{row.orden}</td>
              <td className="border border-gray-300 p-2">{row.club}</td>
              <td className="border border-gray-300 p-2">{row.total}</td>
              <td className="border border-gray-300 p-2">
                <button className="text-blue-500 mr-2">
                  <FaEdit />
                </button>
                <button className="text-red-500">
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
