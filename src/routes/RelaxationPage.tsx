"use client";

import Relaxation from "../components/Relaxation";
import { useRelaxationTable } from "../lib/useRelaxationTable";

export default function RelaxationPage() {
  const { viewModel, tap, kill } = useRelaxationTable();

  return <Relaxation viewModel={viewModel} tap={tap} kill={kill} />;
}
