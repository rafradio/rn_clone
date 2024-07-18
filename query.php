<?php
    session_start();
    $input = fopen("config.txt", "r");
    while(!feof($input)) { 
        $dataDB[] = trim(fgets($input));
    }
    $servername = $dataDB[0];
    $username = $dataDB[1];
    $password = $dataDB[2];
    $dbname = $dataDB[3];
    $conn = new mysqli($servername, $username, $password, $dbname);
    $conn->set_charset('utf8');
//    echo ("New query");
    $tasks=array();
    $project_id = 16;
//    if ($_GET['type']) {
//        $out['type'] = $_GET['type'];
//    }
    $q = "select d.*, avg(t.tt) as tt, t2.tt AS tt2, count(s.shop_id) as cnt, (max(s.lat)+min(s.lat))/2 AS lat, (max(s.lng)+min(s.lng))/2 AS lng 
	from rndb.stat t 
	join rndb.shops s on t.shop_id=s.shop_id
	join rndb.dealer d on d.id=s.dealer_id
	left join (
		select d.id AS ids, avg(t.tt) as tt from rndb.stat t 
		join rndb.shops s on t.shop_id=s.shop_id
		join rndb.dealer d on d.id=s.dealer_id	
		where wave = 43
		group by s.dealer_id order by tt
	) t2 ON d.id = t2.ids
	where wave = 43
	group by s.dealer_id
	order by tt
	";
//    $_SESSION['mapback'] = array();
//    $cat = 0;
//    $_SESSION['mapback'][0] = "RN2019_Clone/query.php";
if (empty($_GET['type'])) {
    

        $q2 = "select d.*, avg(t.fisrt_score_total) as tt, t2.tt AS tt2, count(s.shop_id) as cnt, (max(s.lat)+min(s.lat))/2 AS lat, (max(s.lng)+min(s.lng))/2 AS lng 
            from rosneft_21.tmp_stat_total2 t 
            join rosneft_21.shops s on t.shop_id=s.shop_id
            join rosneft_21.dealer d on d.id=s.dealer_id
            left join (
                    select d.id AS ids, avg(t.fisrt_score_total) as tt from rosneft_21.tmp_stat_total2 t 
                    join rosneft_21.shops s on t.shop_id=s.shop_id
                    join rosneft_21.dealer d on d.id=s.dealer_id	
                    where wave = 367
                    group by s.dealer_id order by tt
            ) t2 ON d.id = t2.ids
            where wave = 367
            group by s.dealer_id
            order by tt
            ";

        $result_qaz = $conn->query($q2);
        while($row_in = $result_qaz->fetch_assoc()) {
            $tasks[] = $row_in;
        }
        $out['data'] = $tasks;
        $out['type'] = "div";
        foreach ($out['data'] as $key => $value) {
                    $out['data'][$key]['tt'] = round($value['tt'],2);
        }
//        $out['backLink'] = $_SERVER['REQUEST_URI'];  
        
        $out['backLink'] = "/RN2019_Clone/query.php";
        $out['session'] = $_SESSION['waves'][0];
	$cat = 0;
} elseif ($_GET['type'] == 'div') {
        
    $q2 = "select d.*, avg(t.fisrt_score_total) as tt, t2.tt AS tt2, count(s.shop_id) as cnt, (max(s.lat)+min(s.lat))/2 AS lat, (max(s.lng)+min(s.lng))/2 AS lng, s.adr as name, s.shop_id as shop_id 
            from rosneft_21.tmp_stat_total2 t 
            join rosneft_21.shops s on t.shop_id=s.shop_id
            join rosneft_21.dealer d on d.id=s.dealer_id
            
            left join (
                    select d.id AS ids, avg(t.fisrt_score_total) as tt from rosneft_21.tmp_stat_total2 t 
                    join rosneft_21.shops s on t.shop_id=s.shop_id
                    join rosneft_21.dealer d on d.id=s.dealer_id	
                    where wave = 367 AND s.dealer_id = " . intval($_GET['id']) .
                    " group by s.shop_id order by tt
            ) t2 ON d.id = t2.ids
            where wave = 367 AND s.dealer_id = " . intval($_GET['id']) .
            " group by s.shop_id
            order by tt
            ";
        $result_qaz = $conn->query($q2);
        while($row_in = $result_qaz->fetch_assoc()) {
            $tasks[] = $row_in;
        }
        $out['data'] = $tasks;
        $out['type'] = "cluster";
        foreach ($out['data'] as $key => $value) {
                    $out['data'][$key]['tt'] = round($value['tt'],2);
        }
        $out['backLink'] = "/RN2019_Clone/query.php";
        $out['session'] = $_SESSION['waves'][0];
        $_SESSION['mapback'][1] = "/query.php?type=div&id=" . intval($_GET['id']);
	$cat = 1;
    
} else {
        $q2 = "SELECT tst.chk_id, DATE_FORMAT(tst.visit_date,'%d-%m-%Y') AS date, tst.tt, s.shop_id as sap_id, s.brand_id as type FROM rosneft_21.tmp_stat_total2 tst
        JOIN rosneft_21.shops s ON tst.shop_id = s.shop_id
        WHERE tst.shop_id = ". $_GET['id']." && tst.wave = 367; ";
        
        $q = "SELECT tst.chk_id, DATE_FORMAT(tst.visit_date,'%d-%m-%Y') AS date, tst.tt, s.shop_id as sap_id, s.brand_id as type FROM rosneft_21.tmp_stat_total2 tst
        JOIN rosneft_21.shops s ON tst.shop_id = s.shop_id
        WHERE tst.shop_id = 2024943 && tst.wave = 367; ";
        $result_qaz = $conn->query($q2);
        while($row_in = $result_qaz->fetch_assoc()) {
            $tasks[] = $row_in;
        }
        $out['data'] = $tasks;
        $out['type'] = "cluster";
        foreach ($out['data'] as $key => $value) {
                    $out['data'][$key]['tt'] = round($value['tt'],2);
        }
        $out['backLink'] = "/RN2019_Clone/query.php";
        $out['session'] = $_SESSION['waves'][0];
}
       // echo (json_encode($total_rez,JSON_UNESCAPED_UNICODE));
//    if (!empty($cat)) {$out['backLink'] = $_SESSION['mapback'][($cat-1)];}
//    $out['backLink'] = $_SESSION['mapback'][($cat)];
 //   if (!empty($cat)) {$out['backLink'] = $_SESSION['mapback'][($cat)];};
    echo json_encode($out);
    
?>