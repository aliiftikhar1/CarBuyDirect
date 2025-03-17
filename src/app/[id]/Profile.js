import MyAccountSection from "../profile-components/myAccountSection";
import MyBiddingSection from "../profile-components/myBidding";
import BiddingSource from "../profile-components/myBiddingSource";
import MyProfileSection from "../profile-components/myprofilesection";

export default function ProfilePage(){
    return(
        <div>
              <MyProfileSection  />
                <MyAccountSection />
                <MyBiddingSection />
                <BiddingSource />
        </div>
    )
}