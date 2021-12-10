import { getSession } from "next-auth/react";

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        statusCode: 302,
      },
    };
  }

  return {
    props: {
      user: session.user || null,
    },
  };
}

// Shows Player saves & details
export default function Profile() {
  return <div></div>;
}
