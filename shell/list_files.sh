#!/bin/bash

# 현재 디렉토리의 파일 및 폴더 목록 출력
echo "현재 디렉토리의 파일 및 폴더 목록:"
ls

# 파일만 세기
file_count=$(ls -l | grep "^-" | wc -l)

echo ""
echo "현재 디렉토리에는 총 $file_count 개의 파일이 있습니다."
