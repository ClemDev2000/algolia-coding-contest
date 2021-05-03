WEBHOOKS=('', '')

for webhook in "${WEBHOOKS[@]}"; do
  stripe webhook_endpoints update $webhook \
    --disabled=true \
    --project-name=localz
done

stripe listen \
  --project-name=localz \
  --forward-to=localhost:3000/api/webhooks \
  --forward-connect-to=localhost:3000/api/webhooks/connect \
  --events=checkout.session.completed,account.updated \
  --print-json

function finish {
  for webhook in "${WEBHOOKS[@]}"; do
    stripe webhook_endpoints update $webhook \
      --disabled=false \
      --project-name=localz
  done
}

trap finish EXIT