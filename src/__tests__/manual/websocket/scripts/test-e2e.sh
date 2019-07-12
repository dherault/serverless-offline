npm run deploy-offline-all &
ID=$!
echo "Starting test servers ..."
echo "Will start testing in 10 seconds ..."
sleep 10
npm run test-all
RC=$?


# Clean up - killing leftover processes
TO_HANDLE=($ID)
PROCESSES=()

while [ ${#TO_HANDLE[@]} -gt 0 ]; do
  NEXT_TO_HANDLE=${TO_HANDLE[0]}
  unset TO_HANDLE[0]
  A=($(ps axo pid,ppid | grep $NEXT_TO_HANDLE))
  for (( i=0; i<${#A[@]}; i=i+2 )); do
    if [ ${A[$i]} -gt $NEXT_TO_HANDLE ]; then
      TO_HANDLE+=(${A[$i]})
    fi
    PROCESSES+=(${A[$i]})
  done
  TO_HANDLE=($(for v in "${TO_HANDLE[@]}"; do echo "$v";done| sort| uniq| xargs))
  PROCESSES=($(for v in "${PROCESSES[@]}"; do echo "$v";done| sort| uniq| xargs))
done
for (( i=${#PROCESSES[@]}-1; i>=0; i-- )); do
  kill -9 ${PROCESSES[i]}
done

exit $RC
