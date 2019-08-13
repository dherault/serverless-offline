if [ ! -d "./.logs" ]; then
  mkdir ./.logs
fi

# deploy test servers
NOW=$(date +"%Y%m%d%H%M%S")
npm --now=$NOW run deploy-offline-all &
ID=$!
echo "Starting test servers ..."
while [ $(($(date +"%Y%m%d%H%M%S") - $NOW)) -lt 30 ]; do
  sleep 1
  M=$(cat ./.logs/$NOW.main.log | grep 'listening on ws://localhost:3001')
  A=$(cat ./.logs/$NOW.authorizer.log | grep 'listening on ws://localhost:3003')
  RS=$(cat ./.logs/$NOW.RouteSelection.log | grep 'listening on ws://localhost:3005')
  if [ ! -z "$M" ] &&  [ ! -z "$A" ] && [ ! -z "$RS" ]; then
    echo "Servers are running ..."
    break
  fi;
done

npm run test-all
RC=$?


# Clean up - killing leftover processes
kill_procs() {
  TO_HANDLE=($1)
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
}

kill_procs $ID

exit $RC
