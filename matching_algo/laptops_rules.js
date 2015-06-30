exports.rules={
laptops: 
["( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( title SU modelid ) ) AND ( cpu EQ cpu ) AND ( ram EQ ram ) AND ( hdd EQ hdd ) AND ( os EQ os ) AND ( graphics EQ graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( title SU modelid ) OR ( modelname EQ modelname ) OR ( modelname SU modelname ) OR ( modelid EQ modelname ) OR ( modelid SU modelname ) OR ( modelname SU modelid ) ) AND ( cpu SU cpu ) AND ( ram SU ram ) AND ( hdd SU hdd ) AND ( os SU os ) AND ( graphics SU graphics ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid EQ modelid ) OR ( modelid SU modelid ) OR ( modelid SU title ) OR ( title SU modelid ) OR ( modelname EQ modelname ) OR ( modelname SU modelname ) OR ( modelid EQ modelname ) OR ( modelid SU modelname ) OR ( modelname SU modelid ) ) AND ( ( cpu SU cpu ) OR  ( cpu SU title ) OR ( title SU cpu ) ) AND ( ( ram SU ram ) OR ( ram SU title ) OR ( title SU ram ) ) AND ( ( hdd SU hdd ) OR ( hdd SU title ) OR ( title SU hdd ) ) AND ( ( os SU os ) OR ( os SU title ) OR ( title SU os ) ) AND ( ( graphics SU graphics ) OR ( graphics SU title ) OR ( title SU graphics ) ) AND ( screentype EQ screentype ) )",
"( ( brand EQ brand ) AND ( ( modelid ASE modelid ) OR ( modelid SS modelid ) OR ( modelid LCSU modelid ) ) AND ( cpu SU cpu ) AND ( ram SU ram ) AND ( hdd SU hdd ) AND ( os SU os ) AND ( graphics SU graphics ) AND ( screentype EQ screentype ) )"
]
//laptops: ["( ( brand EQ brand ) AND ( modelid EQ modelid ) AND ( cpu EQ cpu ) AND ( ram EQ ram ) AND ( hdd EQ hdd ) AND ( os EQ os ) AND ( graphics EQ graphics ) AND ( screentype EQ screentype ) )"]
};


