<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\SocialAccount;
use App\Models\Tag;
use App\Models\Prompt;
use App\Models\PromptImage;
use App\Models\PromptLike;
use App\Models\PromptSave;
use App\Models\Comment;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::factory(50)->create();

        $users->each(function (User $user) {
            SocialAccount::factory()->create([
                'user_id' => $user->id,
                'provider_email' => $user->email,
            ]);
        });

        $tags = Tag::factory(20)->create();

        $prompts = Prompt::factory(250)
            ->recycle($users)
            ->create();

        $pixabayImages = [
    'https://pixabay.com/get/g282f5671d65b025393833ca3294ccfc0b8825d77d45d0019208c639dcc7a3460e523ac92f2619cb7d13205f891eb01d1563145ca3f9f4ee8090086007fd9e154_640.jpg',
    'https://pixabay.com/get/g96c23939ab9a82e149ca70ec3769fc1b656e86830bd232aca59feec9273099eddf37c932674858c07e7de8d551677e0041e2b2e2c9d8757346dd4c06fefedfdb_640.jpg',
    'https://pixabay.com/get/gca08735fcc93497820ee1197e214365368a86f7212d988be827d36eacb7ed9103d7c19311d3d0a759c8bba01198a646436b57517fad5a233375ec40a2c96f347_640.jpg',
    'https://pixabay.com/get/g44d4359ee9decd693336a2f50bbbf3cac17cb21ef7b8ebd64aedeaa65cb8b7166d198c5228f7673eb4082fdc6fbf1b03670759959a79184c876a4ed33224228d_640.jpg',
    'https://pixabay.com/get/g6acc750f2bdd24d9abeeb02a256c6dfd761e15603d339e05d691c5f858206fb8dc5ed2aa6f00192cab6678ccd96cbc2c34ea02d390b8deb417bfc3a063d03bb5_640.jpg',
    'https://pixabay.com/get/ga311160952e9dcaa1f468e2a323efb6a7714e4ef3f0395bf4952cae6ea3f41d2ae1c4d592751ab9bc072b868a3657474b8e1ef11a27442348c5855ef81113f5a_640.jpg',
    'https://pixabay.com/get/g2d43a04c69b5f55a062da2c19e494ec2d88affbebc46c57e9820faccf4aaab9f11b7c7818077d321980a3591008a70e0bb75a7e33dd4520e9c20bdc803d80557_640.jpg',
    'https://pixabay.com/get/gcc35e19c405fc89431cf668b2b07722affbad93fe2e292cf01bf24f4aa54f7aa82d11ecc707fe0895f6be77bef1c080755cb3b64989a276f5c2585df866dc010_640.jpg',
    'https://pixabay.com/get/g9872a3bd9626c9bb676b8f326a4f8d7c650207a0966211b7849df54873fd80a38775b72512b625c2c37754ccc51c9dd3eb1a85fdc4695049bce469754650d52d_640.jpg',
    'https://pixabay.com/get/gfb404b1f2c2f27293ca36c4d475474db9fbc42d4011d38f63ae30fd08bf70cc5d632875816c11973e766bf15ac53ac22889b471b322943312cc5e35ab36d3f8a_640.jpg',
    'https://pixabay.com/get/gcb3bf2bd08950ee4ce4f37f2b264ba9934a73694e23ca2da7ec5dbcd1d510fa161f8b58c998f0fcddfa1c0fd43509c47df0cba1ddea6e23b3ad3666322c05949_640.jpg',
    'https://pixabay.com/get/g9b309e764059ccfe08bd85ffbda0a765125216c0ceb5a3864308e6d868afe4697b7f61b9d914f3877720be463f9f46a50b37f11def8165e593d35c4c5c977c6f_640.jpg',
    'https://pixabay.com/get/gee9ee2b0363e289e4748dd1e49f1f2516d367b3e6ff4d8c1cc9c23d0e77dcc87bc302dd08c9e09e8f47a24f05e802695f5f56c3e2037e4277e55f88f79e8e37f_640.jpg',
    'https://pixabay.com/get/gc0897b67a717884d164654cea47791939de513f8e1fd4fe334b6185ebc4dd280cbee5433add902dde50d0e4236b8be784b12e95f4c8b8ec673cd523b37124220_640.jpg',
    'https://pixabay.com/get/ge2ae1a55559e25b49b2b6119ae027b59913c980a773ccb507446ae84145ec30710ddd30dd2058b82f88a68196682005a5baf6f6582c483981b68a98fc2b122c4_640.jpg',
    'https://pixabay.com/get/g842058accbd05a19f68b633d9da96e43d5b252380ccc2e5cb1bbf65670a26f028a452b0365d947983105f476d56f626ed785dbe0d03249ee70cb8922be99de29_640.jpg',
    'https://pixabay.com/get/ge698958cc50a2379e34214b74781e3f01501e32ba2f6f38c73750f8f32ee9fcb9d403321b6502e415b1b58045fa80daa281d76cb7ce783752360c977b2a78bad_640.jpg',
    'https://pixabay.com/get/gfd39b7a17609c37f1b144d4ac929bd9e28d38ec93e53bc420967b2a6803876c6c536fe879adca7ec5c04de47a549d264a2609e398ba3ea6f1243df41e986a2bb_640.jpg',
    'https://pixabay.com/get/g75cc3e8f7bc511ee540fa283da8bd1087738174759f2fe4c9c846bc159b52346b70afca0b25a11f7b8bfefb141b9c1282e2df7ae972d7a2c7ad621d4691dfcf4_640.jpg',
    'https://pixabay.com/get/g56c3ac0d0f042fe5635e6a174e80301783f1e61b95f712f65b769feba23bd1828637e207e76c2cad28b5466c04c151a02e6076367200d6bd8abd765bb7ea8c3c_640.jpg',
    'https://pixabay.com/get/g7271c921ec7d90e703f7adca204744b30f1262ac8e1f8df0e1aae3224355a6c20ae8278fa3220e3e990943e80ab784da428739cb899921f1c9cd66ff577cf383_640.jpg',
    'https://pixabay.com/get/g27424b0ed705359bff9cd42b6ff5fbb54e0c5921fb1dc512a7c6c9e50cf4669c39be0f0292912f6c3538de9a1f32d9df5bd0ac7b34b7425e64649985456263bb_640.jpg',
    'https://pixabay.com/get/g3c2b1caa6d537803b17527e661f73b3eb5280425c3861ae33184ab2e6ce1c841cc08a35e26d8a93cbd27680dd4f2705af725509f84cce7f925723eea2b16e17b_640.jpg',
    'https://pixabay.com/get/ged3ad51cb2187ef21dce4b515701ddea2310422df39605ff075daf9b226db9602896bb51905cc436afa8e2dbacd818e1936efbc327bb3036613d842183797788_640.jpg',
    'https://pixabay.com/get/g92e8b60ed55fc9f8a86eb8e08149b840ea645dc741a095e7cfa93d276f4302d95f49b393af2cbba8db776574c6402d35335794c98b5495f71dfd36ff4c20ac70_640.jpg',
    'https://pixabay.com/get/gee138a598fd64e9d1e937c8c15c462ed0a479891cdac03e7ec055f094e41bd67f1723250bc95955b51b5a289540ccfe89429cd48b98b9e533eb92a7455dfaab1_640.jpg',
    'https://pixabay.com/get/g46a64ede2736b91ba2b6f329e6d739a943ed6fba31b6a4c0536662c56d26e66ad3f19870acfe439bb208d1cf9069e58e389cc480ec8808bd1c553beacddb7c93_640.jpg',
    'https://pixabay.com/get/gcbd3024ac161ffc2c6630fe32429756b35a019a7ce8e3e5df9bff23a6e889d6cf5ed80a2ae485b01dde65298dd12223e25862392c4d2551fc9d6e89abb68967c_640.jpg',
    'https://pixabay.com/get/g4952306d86c09904e2d375e86193e52a77194945a8734ce9e733b90af2339e126c28038d803e9a17eb8b36670176e6612e531aa12d441336962de53a0dbf2450_640.jpg',
    'https://pixabay.com/get/g028ce0a89c4c30be551e2ca99f02641a9387dd4ee05c198012c18d909d29f17d138ebae3b71d48ad1b191dab3777abe05ff3382e50c7901eb835712db0aeb6af_640.jpg',
    'https://pixabay.com/get/gcb1cffb55e2806b4adec176bc4002f50f2bc527340d4328d15e9fd8c78c89348715e33fed21ba3143b15c906837f29d393a06682a7ac6fccfecfb4147d89440a_640.jpg',
    'https://pixabay.com/get/g2a7ee3497ab4c7a42931904a13417afa8bf0c78635ac203bc0f522b45516ef82841abd26a560483aa453aced1bc4ee9aed623c366f560c871d060ff81e1f652d_640.jpg',
    'https://pixabay.com/get/g28751c22dc0d0c335c0c70866712be522492b28e38e055c968046a9f8f6854a050ad885936b72f676f51eb46db26c018b943cc377a7cca1ede22b0b623bbe2de_640.jpg',
    'https://pixabay.com/get/ge7c91d63c67a0d1641547f08ab08ab52a7898f6976805adfc27eac210b66d26b2cba26a22937a6529775d7d7523f051960b1b974a244567c32aaada4f99b922e_640.jpg',
    'https://pixabay.com/get/gd93fa077def25e9bc8d886668c4363c2b58fd2254a5e53a5ea980a7b8fac429cabb4003858a2de1b1a949fb5f2966c96ea50830ac714bfb68e8bb4bc5f019135_640.jpg',
    'https://pixabay.com/get/gf68860235392b2f9307067bafece2d01628e266a6db3b0042389390aa9855bd0a2c91556b15cbff50d9af11866a4e532e4c05539aef6e490553f2192adc3b904_640.jpg',
    'https://pixabay.com/get/ga247530b9b5dca71f3b4aa867ef77449261eaaa0835dc126f59cbf917d09ebfc51dcaf1e739c6cb2ae76557ed6741c721f1c9eb8365dc3ae2848836d8cd2fed6_640.jpg',
    'https://pixabay.com/get/g1cbd09908e988d1911c6fbf42e6b5121ff0991bd5c56105c733f4e4899e87a6a7402226d7978f8a4d36afaa659d09947cff1e13744d00555f3074b573054e72b_640.jpg',
    'https://pixabay.com/get/gcd13a5aa0375dd5d0d8a81b91407b8dff4508af127f255fe3c04f3604a8d803cf61eab5f3f7c7949ad49f3aa65ed418f87cc6120324cc82ed04828d7ebc6e903_640.jpg',
    'https://pixabay.com/get/gc65be9e6821a9bc6d8ef5c455d077a03ac5cefe5e7faaff685552db1d5afd561a32d73600f36975d48f839aefba091f6dc8fffaf991bc9239f40b94de66f7428_640.jpg',
    'https://pixabay.com/get/gcd87801bec95dde1f6abee8ff6849a06c5d7c0f53cee67e70e57a6d432cdc7f8050194d922031409446688c4f74ee9d5206b80f937a9aa6d2dcff7ede6350260_640.jpg',
    'https://pixabay.com/get/gecb9fe01c91f34cae4fa58458d31cfa5cbd405ee09e27763d763a91689b80ffb7c1d61748e9c8bf7dcb612d8f2b9fadeb2c17fb09c777d907dd80cafa193ea83_640.jpg',
    'https://pixabay.com/get/g28a3b33bc9c5d1337145a4d587d81566898c206539e99b4f04aa57635dbae83ca79835693dd7fbe8dc15c54c9c6e5c88c3ed137d1b173167d957fd07801be227_640.jpg',
    'https://pixabay.com/get/gdf1a08e9f493cd94be01fa8f4c9674ebc987c27236c62a6f41ca045f995d6b07e284e00c87753c0b6ef2bc4f2ba2e1b1e82aad00d9656d09f7ce3bc56edebb4f_640.jpg',
    'https://pixabay.com/get/g237a4163d4e0d1c580ea579787213e6a75a3a475229753f20b724c24c718c8adf2a76ee09b94f5899e0409404ba1fdc26c31b870ac21735d8f12792f59351577_640.jpg',
    'https://pixabay.com/get/gf9c5a98e071f4e8d7a7c546424af9c77e1b850dd02bcf792881281ea085d72edae45ec0739b40a53b70949c47672a2ea42b7c890751bffb2256e314a53d3ff84_640.jpg',
    'https://pixabay.com/get/g7852644e0a68452ceaccdcf7657bd567cb7fa746ecf8c2a753724bb23a18cfe6616d8fc3dea3bd77420411c6fc4ebe19a6e5500cf75bfe4d8d22e273fc44cc06_640.jpg',
    'https://pixabay.com/get/g8882a83abf556c0444b7ca20fe1c6e95763f6eaf66c968fa8c59a309c23c30ff018cee78e03e6f8879f30aecf86e31fc2f8d3ac30cf835f88d4fd71fe5d17d75_640.jpg',
    'https://pixabay.com/get/g42f17fc8d1cb1aafe270404e317eff0d261dd74b714a9fd695af9b7c835e52073acca2b2f645df5814391e4a53d15997ecea114afcc490ec526a44b3541781ae_640.jpg',
    'https://pixabay.com/get/ga3f4be07f4fdfe014bcf6cfefc44cf7ff4ed244bcdb590e411d9acfc8b29848e100d5ef21ff6394c356fca98ec7fa168e287968336c87d73c9b16a944a751317_640.jpg',
    'https://pixabay.com/get/g8e9f38003471f75b84532dc5d618c5742f25b78839f1111562cac0a6dcf941cddc38cbee36d2adc82a0dbfa467a97c40ab60f6ddae7373820a41d4da5662df86_640.jpg',
    'https://pixabay.com/get/g7b8b7481fbe9337f881cc18d87ed7dc49067a23d57ffb103629ff0cbb7c800b020013174a43a1fea324b29467da8d8bce9701a2e5f86c49cc53ec7dea72e682d_640.jpg',
    'https://pixabay.com/get/gfa5c56098f6dbc285e25adb86c539febb96d78622b7f289ebb7e69d6162da1ed95f965f97db5518fc64d9e388beb674e2d27cd87771d4169a7d873a32ed83960_640.jpg',
    'https://pixabay.com/get/g51da49f8efad88d15760c8915f81aa77f18de292d758e4e013e39925475ca7962712704ac42f37cc70f6a9d16fc4ffe290c6ec4a04fb286df99ac1a9d861ab3c_640.jpg',
    'https://pixabay.com/get/g3fda7c4a9f8e11fbe91a299cba3a52111c8552579312a69010da3667ce7953043941faf8d0d97e79a0312cfbfe62fe8c30bd10a17d49c708597f2d8e14311d40_640.jpg',
    'https://pixabay.com/get/g3871b89a9682b216565bbf230c271567f525a7496915d49e29cc3108de4977fb7d0274e62eb4bf067af6396557c43ac16e94b4e67d753b534cc3b76e4e8db67d_640.jpg',
    'https://pixabay.com/get/g29caa130bb4176f1890138f0c4bd8b9eb684d48935415a6b3e265037109c3eb87b5c33bcdf6ef5bc9670134f85f7042a_640.jpg',
    'https://pixabay.com/get/ge5987b12dc66a89139650092a04f2edabd1d41d14adc6c8a7905431d957f1c5dce330ef2bc039f7e2a2234ca2bb83fb0abc7fd7f6326edfc4ab0711ecaf80bb4_640.jpg',
    'https://pixabay.com/get/g7776840c2eb50f783e303599b3e1a8e8c72aba39cea1c8c1050324d0831aa343fe36dad7c95a3becf1f1f0e1a6f4fd8fa2426ccaf8992eca49f7656ba234d020_640.jpg',
    'https://pixabay.com/get/g389542a9f7a28196c8ff1bb2dc64398b7e5a3678b9e33e76cd65260dd33cc8bcae06d8a156ed876ede0f594865899035d2ef65d7c53ff1ad3dcd1465b53bdacd_640.jpg',
    'https://pixabay.com/get/g11a5643f68196141460bd81d62bd5d5e22b52500fe9d025f78e367d5c8bb9b68609200f83aa51ee01d552be5ed36424feb16d49a7232871b4010144cfc68653a_640.jpg',
    'https://pixabay.com/get/g141917e2dc2d17de3f7fb30249781176ea135c7dd488ce72e9240faea1825e0d31757f5fdb0e08e6fb13355f2ac08908f8078ba333a917b0f243deef983663e8_640.jpg',
    'https://pixabay.com/get/gbe84630be185913e6f4e87c2ff7c20dd5228e36f9729b570563d7d84ced684c2dc31fad3da9f6f0e28976573442c09c5137382085793ba588be6463db4ca1ead_640.jpg',
    'https://pixabay.com/get/g9f083071b2aaaba2a105dc45b753cbee0353376f371f19e38cfcda7e920293f9a63ca56f908675272e6524cd1b2af4435da49c3ce578688f08c37b47751308fa_640.jpg',
    'https://pixabay.com/get/g86ac8cf7c1a46501d96402b071c6d1e2037608aef6fd1d965b30dd99edff69718eb593a2ca374871a1921018783bdd8584c9aabced41f0df29fbed35eeed10e3_640.jpg',
    'https://pixabay.com/get/g1133fd676003e6b6256454580aaab566594d46eb8b404544d3b1f4d2d91d3566b178cc76ced3927bbd8d1220f1eac4d43306609f890be33fc7f6b31e292776ad_640.jpg',
    'https://pixabay.com/get/g0fa6f4200dff1106d7eb4b7540c7d69756c7bf335cdfb0bcc6fa8d97bd4d45013f977aa9ef548705a52eb1b1a7dd647ca9cca6aad62c5811a75b2abbbb2ac9b7_640.jpg',
    'https://pixabay.com/get/gb57ef7d2f142fa83af9a17de3fd17144f8969f432f49ca15dfd3176e5b13657d0179a29263f3ec4635f17706e474027dfbf35f4d46b9636129735959a7faac6c_640.jpg',
    'https://pixabay.com/get/g306a660a75954aab4edf24b71ae7d951bb67115a5bbecbff8d244c48bd5dede8e055bff999b97e5916b35ac0414d3aab1b1a7cd0fdd3a672e35225e57112f6f0_640.jpg',
    'https://pixabay.com/get/ga87e164d2173d6cf5f2335da29b551f8758ea86510776170d4091011d5d8093c31d910ca5957233e4df8fe51be225b9780e74a614700b9ca520fbb9906144329_640.jpg',
    'https://pixabay.com/get/g94bed4ddf5369bb2e1e7eca6ed983063a73df70fc1fa3a224ab47f0754d235a27c72d5222ca91b550e9a1ca1a9b5a6d8e495f1b0ea58befbcfd9eb6cf394a95a_640.jpg',
    'https://pixabay.com/get/gc8e0bb2eb46433ae3b4dfbe7dce25c58fa5c562103be3a64776186740b789e8e5e9ec33453a2aa1847b03fc85c0637a4c60954249530389d916f167eaade98cd_640.jpg',
    'https://pixabay.com/get/gae366c1fa5496043030e07d33933db5bf9630f7db10dfa6f1bf3eb2d38636d91bc18a925fa2c152ff7f52adcd56789e88514f4cc9ee2983cba970677ae02066f_640.jpg',
    'https://pixabay.com/get/g1c3d73862cda2f21d3e601e5c65527c26b2f94215cca19e626433175d58ca88e068cc009887bf6c520ab395c3d6e2cac6b6ac8233e33cf5b32f5309f166a741a_640.jpg',
    'https://pixabay.com/get/g56cba676ab563ac2d61de6a51c71ae546272453b86176ab51762a25ded46d5e698a74f2ecd2e7952843b1758cad3b02cf4aa617b604213ed1b6b1e3d306209eb_640.jpg',
    'https://pixabay.com/get/g99abaa039e7e98e74e0712180c0f5e378b412d0bf696012d997c5ed759f09c82f8694925e5377a1224f0cdbb0de633c38147555cfee1fdc2e23fd749ab30624e_640.jpg',
    'https://pixabay.com/get/g61208866e3eccf1945fd1029bdfa8a8b669418bc1a340cd4d6299d166ff0e26d9fa6d4c54607b15d6415fc215b3447d8eba9729dec72e049737ea42b58481f58_640.jpg',
    'https://pixabay.com/get/gfb7a65824c8892605a93a101a4618d8e8bcc4a518e0c81d2ae794f14de39d318bd7d6ac9e9d679e8d66a8e48feb37fc9415c07c370190114c64c4c9240273ac8_640.jpg',
    'https://pixabay.com/get/g181f45d335d2c87fb95226726f3b0fcd00a55cdc3e2318a4533e1207a95776cfeb12d6b9cdb4cf9dbde95b898ee9e8ccf13796ebc4675121f621605c28afc00c_640.jpg',
    'https://pixabay.com/get/gd437d848c412a930f1cbed6fab860308f6b62184e990e0bd81e6835d0ae424f816b60fb0df9942445175381ec0a291a247329051e51415901cd85cba9206bbdd_640.jpg',
    'https://pixabay.com/get/gf164db7da5868e65abd95ea6f4b0b037c370834ed488b26e5d0569ccbc1eee3cb34251fe3ba0b981be711648bcce7ee25a78a3787856aaf165c84c8c019079f6_640.jpg',
    'https://pixabay.com/get/g388f6e0919bbca9efb92efcdd2964cc510bbcb2f91561e64446d4d43263a5100560e63936b591db02542712955e63e834cdfcaf1d3c6cf7bbd2520ee0eb1f938_640.jpg',
    'https://pixabay.com/get/gcb2d742ce0a2bb253c2349c3d23cc34f563b5ffdeeeeb7981d2778695bbe15c20c5500bc9df707352f7fa5a623977ea91119625ae93096103d2a27b7e0e71b39_640.jpg',
    'https://pixabay.com/get/g1c319682dd95eab40873807c052fddd695fdd92698849d4522b2a7744dba5d3f6c7eeae5e14cb78e7f62169b31e7a02a_640.jpg',
    'https://pixabay.com/get/gf3015a68c23e763ce9833fd9a9cbaff6fd5b28e5464f09abb5b772c832918849b0eb2b67b2a9cc61c0059f4cbbe8b7d810504a8ebdaecb84803d2e57796c7f74_640.jpg',
    'https://pixabay.com/get/ga8acd95d3abe4e7036a81a3859964138f868df3c4ecb81c9c452b8c2f39aebe38458f7cf500e4e2be7caa877d6d2a0611918d27cbf5d4727a63a3a3d11cf0686_640.jpg',
    'https://pixabay.com/get/ga7d90b28a99cac915e9eaa73d115425f3ed9f1d0a233d880ea84fb26e9bd4faa2205b9eadb6944caa1022dc1a12d16e6ad1ac1c41443f944574287f8894c3ad1_640.jpg',
    'https://pixabay.com/get/gbb917dbc617b012c45d747b32c8dc4a2919b9b570a7ab8173b1c0ba7fe052a9ac477ef5a921ae34e1de64c8affa9b161b17e93cfde037818f6a655a54071ab2e_640.jpg',
    'https://pixabay.com/get/g214bf288693cc0d88ce6b76a78a84cdf2c044434d53ac0794d9dc4c7191fade17237af3b54df4e4c6ba578a37abdb4e1_640.jpg',
    'https://pixabay.com/get/g0ea324557f26133008e5e0dd9f31d2280d595b4acf6517b784352fe1d4200c79b53bf9f86dd9c0ff95284b359327d77fabcc853e2c6684f13ce2428aa059018c_640.jpg',
    'https://pixabay.com/get/g50ed3dee3b3746693442dbd90ddb7922eab0bc5418b6258fdd4596d219d9a5df1cbc5edb7f7403e16156685267378e4cd07a5981fb2da7c0e95c4d7f544d73af_640.jpg',
    'https://pixabay.com/get/g95bf67dd4eeee4d47f5ff286e8d00fe23c4f254b517d230a7b88bfc4143d36018e21ae07f7574c5a0df5367955f6ed79_640.jpg',
    'https://pixabay.com/get/g6a795493b820182172d4ab833421ee78f05c91669c73bf85e3d363fbdc22a377fc719d4f47c5eeed860719a0bd9094e15d1e3e1d33f06bf59a8025ea3e0e8b52_640.jpg',
    'https://pixabay.com/get/g9159cd731b2ec1c3f8592c222d445a14bf6b140206508dfa37fddf0603cd8c983a8e32c48ab6dfc511355234df61ea187c89a5bf1d04b28abb833d072e846764_640.jpg',
    'https://pixabay.com/get/g701164c790468b964017c09941105113774daa4109a0816f8fec5e889b90e36eba29ac93aa7beec840a28c79448ffcbfa8ab87fa23f36a318e87e53a28fcb2e1_640.jpg',
    'https://pixabay.com/get/gb96515462d03851f54d42a89fa16672b1c774933acee1ce7ee457b371b8c7acb4c5ca3e877872b983dd862e2f1c59e9f4dfba42095abc8b71f620adbe37931c8_640.jpg',
    'https://pixabay.com/get/g0902e5fb1fc3ac7a7829f784879f6980469ebb392157362838a89ac9965c813af7c844fd64d06c674fa0e80eff9f10b7f5a6a20f4351c89e727f09e782b1e0ae_640.jpg',
    'https://pixabay.com/get/gd84eed73e8a1b31cb3f2607959242b89e8ac76162406701692da9bcaf20dd6e77465c08a5618f0f018f2b5ad661e4e31e080250af63d86c3b60fddd4d9210e28_640.jpg',
    'https://pixabay.com/get/g43bf634548a36e8c92ee0615c281e2f2b178c17d0a88b38242d80d3700d7e547257203b9d748855c4840c3891fa17ee5_640.jpg',
    'https://pixabay.com/get/g180b400fa6980bff64c798d54438471dc33a9b5e65c73fe008f6f0e9273d4edf920bbb5cb8c1a34f80c2e99c060c820ea9abb3988221ed692c8f8d57834a89cc_640.jpg',
        ];

        foreach ($prompts as $prompt) {
            $promptTags = $tags->random(rand(1, 4))->pluck('id')->all();
            $prompt->tags()->attach($promptTags);

            $imageCount = rand(0, 2);
            for ($i = 0; $i < $imageCount; $i++) {
                PromptImage::create([
                    'prompt_id' => $prompt->id,
                    'path' => $pixabayImages[array_rand($pixabayImages)],
                    'position' => $i,
                    'width' => 1280,
                    'height' => 720,
                    'format' => 'jpg',
                ]);
            }
        }

        $allPrompts = Prompt::all();

        $users->each(function (User $user) use ($allPrompts) {
            $randomPrompts = $allPrompts->random(rand(10, 40));

            foreach ($randomPrompts as $prompt) {
                if (rand(0, 1)) {
                    PromptLike::firstOrCreate(
                        ['user_id' => $user->id, 'prompt_id' => $prompt->id],
                        []
                    );
                }

                if (rand(0, 1)) {
                    PromptSave::firstOrCreate(
                        ['user_id' => $user->id, 'prompt_id' => $prompt->id],
                        []
                    );
                }

                if (rand(0, 1)) {
                    Comment::create([
                        'prompt_id' => $prompt->id,
                        'user_id' => $user->id,
                        'parent_id' => null,
                        'body' => fake()->sentence(20),
                        'depth' => 0,
                        'is_edited' => false,
                        'is_deleted' => false,
                        'like_count' => 0,
                    ]);
                }
            }
        });

        foreach ($allPrompts as $prompt) {
            $prompt->like_count = $prompt->likes()->count();
            $prompt->save_count = $prompt->saves()->count();
            $prompt->comment_count = $prompt->comments()->count();
            $prompt->save();
        }
    }
}
