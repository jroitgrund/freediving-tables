"use client";

import OneBreath from "../components/OneBreath";
import { useOneBreathTable } from "../lib/useOneBreathTable";

export default function RelaxationPage() {
  const { viewModel, tap, kill } = useOneBreathTable();

  return <OneBreath viewModel={viewModel} tap={tap} kill={kill} />;
}
