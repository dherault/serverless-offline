def remaining_time(event:, context:)
  { 'remainingTime' => context.get_remaining_time_in_millis }
end
