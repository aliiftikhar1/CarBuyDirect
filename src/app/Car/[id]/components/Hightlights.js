export default function Highlights({ data }) {
    return (
      <div className="px-20 py-30 w-full flex flex-col">
        {data?.CarSubmission?.highlights ? (
          <div
            dangerouslySetInnerHTML={{ __html: data.CarSubmission.highlights }}
          ></div>
        ) : (
          <p>No highlights available.</p>
        )}
      </div>
    );
  }
  