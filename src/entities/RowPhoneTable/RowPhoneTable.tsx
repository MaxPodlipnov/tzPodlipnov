import React from "react";
import "./RowPhoneTable.css";
import { useMemo, useEffect, useState } from "react";
import { getCallRecord } from "../CallRecording";
import AudioPlayer from "../../widgets/AudioPlayer/AudioPlayer";
import CallQuality from "../../widgets/CallQuality/CallQuality";
import { RowPhoneTableProps } from "@/shared/types";

const RowPhoneTable: React.FC<RowPhoneTableProps> = ({ call }) => {
  const [recording, setRecording] = useState<string | null>(null);
  const [showPlayer, setShowPlayer] = useState<boolean>(false);

  const durationCall = useMemo(() => {
    const duration = call.time;
    if (duration === 0) return "";
    const mins = Math.floor((duration % 3600) / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }, [call.time]);

  const iconCall = useMemo(() => {
    return call.in_out === 1 ? (
      <img src={"icon_incoming.svg"} alt="inCall" />
    ) : (
      <img src={"icon_outgoing.svg"} alt="outCall" />
    );
  }, [call.in_out]);

  useEffect(() => {
    const fetchRecording = async () => {
      if (!call.record || !call.partnership_id) {
        return;
      }

      try {
        const recordingUrl = await getCallRecord(
          call.record,
          call.partnership_id
        );
        setRecording(recordingUrl);
      } catch (err) {
        console.error("Error loading recording for call:", call.id, err);
      }
    };

    fetchRecording();
  }, [call.record, call.partnership_id, call.id]);

  const handleRowClick = () => {
    if (recording) {
      setShowPlayer(!showPlayer);
    }
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };

  return (
    <tr
      className="table-row"
      key={call.id}
      onClick={handleRowClick}
      style={{ cursor: recording ? "pointer" : "default" }}
    >
      <td className="table-header-title">{iconCall}</td>
      <td className="table-header-date">{call.date.slice(11, 16)}</td>
      <td className="table-header-person_avatar">
        {
          <img
            className="person_avatar"
            src={call.person_avatar}
            alt="avatar"
          />
        }
      </td>
      <td className="table-header-from_number">{call.from_number}</td>
      <td className="table-header-source">{call.source}</td>
      <td className="table-header-rating">
        {call.quality && <CallQuality quality={call.quality} />}
      </td>
      <td className="table-header-time">
        {/* Фиксированный контейнер для времени/плеера */}
        <div className="duration-container">
          {showPlayer && recording ? (
            <div
              className="audio-player-wrapper"
              onClick={(e) => e.stopPropagation()}
            >
              <AudioPlayer src={recording} onClose={handleClosePlayer} />
            </div>
          ) : (
            <span className="duration-text">{durationCall}</span>
          )}
        </div>
      </td>
    </tr>
  );
};

export default RowPhoneTable;
