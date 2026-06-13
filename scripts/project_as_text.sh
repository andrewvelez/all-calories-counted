#! /usr/bin/env bash
#  by: Andrew Velez 2026

main() {
    local script_dir root project output
    local filelist filename

    script_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd -P)"
    root="$(cd -- "${script_dir}/.." && pwd -P)"
    project="${root##*/}"
    output="${project}.txt"

    filelist=(
        "${root}/build.js"
        "${root}/bun.lock"
        "${root}/bunfig.toml"
        "${root}/package.json"
        "${root}/tsconfig.json"
        "${root}"/src/*.*
        "${root}"/web/*
        "${root}"/src-tauri/capabilities/*
        "${root}"/src-tauri/src/*
        "${root}"/src-tauri/build.rs
        "${root}"/src-tauri/Cargo.lock
        "${root}"/src-tauri/Cargo.toml
        "${root}"/src-tauri/tauri.conf.json
    )

    {
        for filename in "${filelist[@]}"; do
            if [ -f "${filename}" ] && [ -r "${filename}" ]; then
                printf '```%s\n' "${filename#"${root}/"}"
                bat -p -P "${filename}"
                printf '\n```\n\n'
            fi
        done
    } > "${output}"
}

main "$@"
