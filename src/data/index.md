---
alias: CacheIt - Simple Note Taker
layout: layout.njk
permalink: "/"
---
# {{ alias }}

<p class="lead mb-4">End-to-end encrypted notes. 100% free. Visible only to you.</p>

<p class="mb-3"><span class="badge bg-info text-dark">Active development</span> MVP targeted for August 2026.</p> 


<h2 class="mt-5 mb-3">Project repositories</h2>

<table class="table table-dark table-bordered table-hover mb-4">
  <thead>
    <tr>
      <th scope="col">Repository</th>
      <th scope="col">About</th>
      <th scope="col">Link</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Server</td>
      <td>Spring Boot (Kotlin, Gradle Kotlin DSL) with PostgreSQL.</td>
      <td><a class="btn btn-outline-info btn-sm" href="https://github.com/martinsterentjevs/cacheit-server">Github</a></td>
    </tr>
    <tr>
      <td>Desktop</td>
      <td>Avalonia on .NET 10.</td>
      <td><a class="btn btn-outline-info btn-sm" href="https://github.com/martinsterentjevs/cacheit-desktop">Github</a></td>
    </tr>
    <tr>
      <td>Android</td>
      <td>Kotlin with Jetpack Compose.</td>
      <td><a class="btn btn-outline-info btn-sm" href="https://github.com/martinsterentjevs/cacheit-android">Github</a></td>
    </tr>
    <tr>
      <td>Documentation</td>
      <td>Architecture decisions, design system, project conventions and landing page source.</td>
      <td><a class="btn btn-outline-info btn-sm" href="https://github.com/martinsterentjevs/cacheit-spec">Github</a></td>
    </tr>
  </tbody>
</table>

<h2 class="mt-5 mb-3">Why no web client</h2>

<p class="mb-0">
  CacheIt uses per-field client-side encryption with a zero-trust key model —
  the server never holds a decryption key or plaintext note content. A web
  client would require server-side decryption to render anything, which breaks
  that model entirely. Native clients (Avalonia desktop, Jetpack Compose
Android) are the deliberate trade-off — this is a design constraint, not a
missing feature.
</p>