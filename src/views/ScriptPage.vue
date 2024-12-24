<template>
  <div>
    <h1>Home Page</h1>
    <p>Welcome to the home page</p>
  </div>
</template>

<script setup lang="ts">
import { startAnalysisFromFile } from '../utils/baseScriptBatch'
startAnalysisFromFile()

// Probably no longer auto-starting the analysis, so we need to copy store content here.
</script>
