{{
    config(
        materialized='view',
        schema='playground'
    )
}}

with e as (
SELECT auction_id,
unit_id,
SUM(CASE WHEN event_id = 6 THEN value END) as unmute,
SUM(CASE WHEN event_id = 5 THEN value END) as mute,
SUM(CASE WHEN event_id = 7 THEN value END) as expand,
SUM(CASE WHEN event_id = 2 THEN value END) as page_flip_left,
SUM(CASE WHEN event_id = 3 THEN value END) as page_flip_right,
SUM(CASE WHEN event_id = 10 THEN value END) as transition_up,
SUM(CASE WHEN event_id = 11 THEN value END) as transition_down,
SUM(CASE WHEN event_id = 12 THEN value END) as direction_change,
SUM(CASE WHEN event_id = 13 THEN value END) as reveal,
array_agg(timestamp) as timestamps
from {{ref ('engagement_events') }}
where auction_id is not null
group by auction_id,unit_id),
vw50pct as
(SELECT distinct auction_id
FROM {{ ref('viewability_50pct')}}
WHERE auction_id is not null),
vw2s as (
SELECT distinct auction_id
FROM {{ ref('viewability_2sec_50pct')}}
WHERE auction_id is not null),
vwpx as (
SELECT distinct auction_id, unit_id 
FROM {{ref('viewability_onepx')}}
where auction_id is not null),
vw as (
SELECT distinct auction_id, unit_id
FROM {{ref('viewability')}}),
v as (
SELECT MAX(duration) AS duration,
duration_bypass AS duration_bypass,
MAX(quartile_event) AS max_quartile_event,
-- MAX(progressEventToMillisecs(v.progress_event)) AS max_progress_event_millisecs,
-- COALESCE(MAX(CASE WHEN video_length_type_value = ${VideoLengthType.VL_PLAYER_METADATA_VALUE} THEN
--          video_length
--          ELSE NULL END),
-- ANY_VALUE(video_length)) AS video_length,
auction_id,
unit_id
FROM {{ref('video_depth')}}
GROUP BY auction_id,unit_id,duration_bypass
),
m as (
SELECT distinct auction_id, unit_id 
FROM {{ref('mouseovers')}}
where auction_id is not null
),
c as (
SELECT distinct auction_id, unit_id 
FROM {{ref('clicks')}}
where auction_id is not null
),
r as (
SELECT ANY_VALUE(ymd) AS ymd,
ANY_VALUE(hour) AS hour,
unit_id,
auction_id,
COALESCE(MAX(render_result),'') AS render_result,
COALESCE(MAX(user_id),'') AS user_id,
COALESCE(MIN(CASE WHEN render_result = 'creative' THEN 0 WHEN render_result IS NULL THEN 0 ELSE 1 END),0) AS is_default,
ANY_VALUE(page_referrer) as page_referrer,
ANY_VALUE(NULLIF(rev_hash, '')) as rev_hash
FROM {{ref('renders')}}
WHERE auction_id is not null
GROUP BY auction_id, unit_id),
aop as (
SELECT auction_id
FROM {{ref('ad_on_page')}})

SELECT r.ymd,
r.hour,
r.auction_id,
r.user_id,
r.render_result,
r.is_default,
CASE
WHEN m.auction_id IS NOT NULL THEN 1
ELSE 0
END AS mouseovers,
CASE
WHEN c.auction_id IS NOT NULL THEN 1
ELSE 0
END AS clicks,
COALESCE(v.duration,0) AS max_duration,
v.duration_bypass AS duration_bypass,
COALESCE(v.max_quartile_event,0) AS max_quartile_event,
-- COALESCE(v.max_progress_event_millisecs,0) AS max_progress_event_millisecs,
-- CASE
-- WHEN (NOT v.duration_bypass AND v.duration > 0)
-- OR (v.duration_bypass AND v.max_quartile_event > 0)
-- OR (v.duration_bypass AND v.max_progress_event_millisecs > 0)
-- THEN 1
-- ELSE 0
-- END AS is_max_duration_gt_zero,
-- CASE
--   WHEN (NOT v.duration_bypass AND v.duration >= v.video_length)
--     OR (v.duration_bypass AND v.max_quartile_event = ${QuartileEvent.QE_COMPLETE_VALUE})
--   THEN 1
--   ELSE 0
-- END AS is_video_completion,
-- COALESCE(v.video_length,0) AS video_length,
CAST(0 AS INT) AS rendered_bs2,
CASE
  WHEN r.auction_id IS NOT NULL AND r.render_result = 'creative' THEN 1
  ELSE 0
END AS rendered,
CASE
  WHEN vw.auction_id IS NOT NULL THEN 1
  ELSE 0
END AS viewable,
CASE
  WHEN vwpx.auction_id IS NOT NULL THEN 1
  ELSE 0
END AS viewable_one_px,
CASE
  WHEN vw2s.auction_id IS NOT NULL THEN 1
  ELSE 0
END AS viewable_2sec_50pct,
CASE
   WHEN vw50pct.auction_id IS NOT NULL THEN 1
   ELSE 0
 END AS viewable_50pct,
 r.unit_id,
 CAST(0 AS BIGINT) AS format_id,  --why though?
 e.unmute,
 e.mute,
 e.expand,
 e.page_flip_right,
 e.page_flip_left,
 e.transition_up,
 e.transition_down,
 e.direction_change,
 e.reveal,
 r.page_referrer,
 r.rev_hash,
 CASE
   WHEN aop.auction_id IS NOT NULL THEN 1
    ELSE 0
 END AS ad_on_page
 FROM r
 LEFT JOIN m on r.auction_id = m.auction_id and r.unit_id = m.unit_id
 LEFT JOIN c on r.auction_id = c.auction_id and r.unit_id = c.unit_id
 LEFT JOIN v on r.auction_id = v.auction_id and r.unit_id = v.unit_id
 LEFT JOIN vw on r.auction_id = vw.auction_id and r.unit_id = vw.unit_id
 LEFT JOIN vwpx on r.auction_id = vwpx.auction_id and r.unit_id = vwpx.unit_id
 LEFT JOIN vw2s on r.auction_id = vw2s.auction_id
 LEFT JOIN vw50pct on r.auction_id = vw50pct.auction_id
 LEFT JOIN e on r.auction_id = e.auction_id and r.unit_id = e.unit_id
 LEFT JOIN aop on r.auction_id = aop.auction_id
 WHERE r.auction_id is not null