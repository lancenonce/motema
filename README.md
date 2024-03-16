![Motema banner](https://github.com/lancenonce/motema/assets/40670744/418b2e48-6e76-4878-a452-4718e7142bc8)

# Motema: the ZKML Geiger Counter
This project was built for the ETH Oxford 2024 hackathon. The inspiration for this project arises from the unfair treatment and compensation of Congolese miners who enable us to live in the tech-driven world we enjoy today. Wishing the Democratic Republic of Congo peace, prosperity, and health. 

# 🩵🇨🇩❤️

## Building the project
Download the chrome extension in `motema_extension`. Go to `Manage extensions` in your browser, Developer Mode, Load Unpacked, and upload the file. 

Test the extension by searching for an Apple product on Amazon. After you donate and send the transaction, you will see a confirmation screen:
![telegram-cloud-photo-size-4-6015053444546674113-y](https://github.com/lancenonce/motema/assets/40670744/367539fc-e768-4557-8d21-e5db9637474e)


Then, clone the repository and find the `.env.example` file under the `zkml_geiger` directory. Copy this and fill in the values.

Create a virtual environment and install all the packages found in `requirements.txt`

```bash
pyenv activate virtualenv
pip install -r requirements.txt
```
Finally, run the server:
```bash
python zkml_geiger/server.py
```
The process will be running on `http://127.0.0.1:8080`. Paste your crypto address, and click "start." Make sure you have the right chainid under the `transmit` function in `geipy.py`.

After start is clicked, check out the console to see the logs of the zkp being proven and the transaction being verified. Remember, we give some time (about 40 seconds) in the beginning of the script for the Geiger counter scan. If you don't have a geiger counter, no worries, we will end up using the files already uploaded in `data`. 

When the txn is done, you'll see the results on the screen:
<img width="1157" alt="Screenshot 2024-03-10 at 5 32 11 PM" src="https://github.com/lancenonce/motema/assets/40670744/6aeaf199-64ca-49a3-b781-8ff0a3be7b97">

## Motema details
Motema is an efficient method for Congolese miners to get paid more for their work. There are two sides: the consumer / donator and the miner.

#### Consumer
Under the `NearBosFE` and `motema_extension` directories, you will find a Chrome extention that scrapes web results for products that use cobalt and computes an (hacky) estimate of how much of the metal was used in the product.
This amount is converted to ETH, and a donation page pops up prompting the user to donate ETH to the miners that extracted the cobalt in their product. The ETH goes to the MotemaPool contract under `contracts`

#### Miner
This is where the zkml is used. We have to somehow prove that a miner actually is a miner. Unfortunately, many people, even children, enter mines in an aim to earn more income. Therefore official miners aren't the only ones who deserve compensation.
Theoretically, we'd set up a station outside the large mining areas, and allow people to claim using an address to their crypto wallet (perhaps in the future we'll use account abstraction for this). In order to claim, they undergo a body scan with a geiger counter.
The reason we use a geiger counter is due to the Uranium traces found in cobalt mines. The people who enter often mine with their raw hands, exposing themselves to radiation. We detect the radiation, then use a [Giza Action](https://actions.gizatech.xyz/welcome/giza-actions-sdk) to read the data from the Geiger counter, run it through a Cairo program that determines if their radiation exposure is above the threshold, and generates a proof
Due to the prohibitive cost of proving Cairo proofs directly on L1 (in our case, Etherlink w/ Tezos), instead of verifying the proof on-chain, we verify it with the Giza CLI, then sign the proof, attesting that the user generated the proof in question.
After the proof and signature are verified, we call the `claim` function in our `MotemaPool` contract, sending the miner some ETH for their work.

## Assumptions
We know this isn't a fool-proof concept, and would like to highlight some key assumptions:
- The data coming from the geiger counter isn't proven, because the geiger counter in use doesn't have a microprocessor. It would be nice to sign the raw geiger data, but alas, you need to trust us to use the proper inputs. See `zkml_geiger/geipy.py` to see how we fetch the CSV files from the flipper zero connected to the geiger counter and process them as numpy arrays for our ML model
- We don't want to incentivize radiation exposure. The incentives in the Congo are already corrupted due to the natural resources there. We don't want to incentivize the community to mine more because they get paid more. Our goal is to compensate them so they can send their children to school, live better lives, and take control of their raw material supply chains
- We don't prove the zkp on-chain, for computational efficiency, we prove it off-chain, then sign it. This is the key feature of the Giza Agent. In the future, when STARKs are easier to verify on-chain, we will use them

The future we want, as human beings, is fair treatment and freedom for all. Our dream is to help Congolese miners pay for their families to eat and for their children to go to school. Cypherpunks write code. This is the future we can build.

![Let's educate the kids, never exploit them](https://github.com/lancenonce/motema/assets/40670744/1134ea9f-4cf6-46ab-a0d7-57beaa997f2d)
